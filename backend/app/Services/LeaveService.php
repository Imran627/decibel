<?php

namespace App\Services;

use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class LeaveService
{
    /**
     * Calculate inclusive day span between two dates (simple version — no
     * weekend/holiday exclusion; extend here if the business needs it).
     */
    public function calculateDays(string $startDate, string $endDate): float
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        if ($end->lt($start)) {
            throw ValidationException::withMessages([
                'end_date' => 'End date must be on or after the start date.',
            ]);
        }

        return $start->diffInDays($end) + 1;
    }

    public function balanceFor(int $employeeId, int $leaveTypeId, int $year): LeaveBalance
    {
        return LeaveBalance::firstOrCreate(
            ['employee_id' => $employeeId, 'leave_type_id' => $leaveTypeId, 'year' => $year],
            ['allocated_days' => 0, 'used_days' => 0]
        );
    }

    public function approve(LeaveRequest $request, int $reviewerId, ?string $comment = null): LeaveRequest
    {
        $balance = $this->balanceFor($request->employee_id, $request->leave_type_id, (int) $request->start_date->year);

        $remaining = $balance->allocated_days - $balance->used_days;
        if ($remaining < $request->total_days) {
            throw ValidationException::withMessages([
                'total_days' => "Employee only has {$remaining} day(s) remaining for this leave type.",
            ]);
        }

        $balance->increment('used_days', $request->total_days);

        $request->update([
            'status' => 'approved',
            'reviewed_by' => $reviewerId,
            'review_comment' => $comment,
            'reviewed_at' => now(),
        ]);

        return $request;
    }

    public function reject(LeaveRequest $request, int $reviewerId, ?string $comment = null): LeaveRequest
    {
        $request->update([
            'status' => 'rejected',
            'reviewed_by' => $reviewerId,
            'review_comment' => $comment,
            'reviewed_at' => now(),
        ]);

        return $request;
    }
}
