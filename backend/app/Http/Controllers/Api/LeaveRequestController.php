<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLeaveRequestRequest;
use App\Http\Resources\LeaveRequestResource;
use App\Models\LeaveRequest;
use App\Services\ActivityLogger;
use App\Services\LeaveService;
use Illuminate\Http\Request;

class LeaveRequestController extends Controller
{
    public function __construct(private LeaveService $leaveService) {}

    public function index(Request $request)
    {
        $query = LeaveRequest::with(['employee', 'leaveType']);

        if ($employeeId = $request->query('employee_id')) {
            $query->where('employee_id', $employeeId);
        }
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $perPage = min((int) $request->query('per_page', 20), 100);
        $records = $query->orderByDesc('created_at')->paginate($perPage);

        return $this->success([
            'items' => LeaveRequestResource::collection($records->items()),
            'pagination' => [
                'current_page' => $records->currentPage(),
                'total' => $records->total(),
                'last_page' => $records->lastPage(),
            ],
        ]);
    }

    public function store(StoreLeaveRequestRequest $request)
    {
        $data = $request->validated();
        $data['total_days'] = $this->leaveService->calculateDays($data['start_date'], $data['end_date']);
        $data['status'] = 'pending';

        $leaveRequest = LeaveRequest::create($data);

        ActivityLogger::log('leave.requested', 'Leave request submitted', 'LeaveRequest', $leaveRequest->id);

        return $this->success(new LeaveRequestResource($leaveRequest->load(['employee', 'leaveType'])), 'Leave request submitted', 201);
    }

    public function approve(Request $request, LeaveRequest $leaveRequest)
    {
        $data = $request->validate(['comment' => ['nullable', 'string', 'max:500']]);

        $this->leaveService->approve($leaveRequest, $request->user()->id, $data['comment'] ?? null);

        ActivityLogger::log('leave.approved', 'Leave request approved', 'LeaveRequest', $leaveRequest->id);

        return $this->success(new LeaveRequestResource($leaveRequest->fresh(['employee', 'leaveType'])), 'Leave request approved');
    }

    public function reject(Request $request, LeaveRequest $leaveRequest)
    {
        $data = $request->validate(['comment' => ['nullable', 'string', 'max:500']]);

        $this->leaveService->reject($leaveRequest, $request->user()->id, $data['comment'] ?? null);

        ActivityLogger::log('leave.rejected', 'Leave request rejected', 'LeaveRequest', $leaveRequest->id);

        return $this->success(new LeaveRequestResource($leaveRequest->fresh(['employee', 'leaveType'])), 'Leave request rejected');
    }

    public function balances(Request $request, int $employeeId)
    {
        $year = $request->query('year', now()->year);

        $balances = \App\Models\LeaveBalance::with('leaveType')
            ->where('employee_id', $employeeId)
            ->where('year', $year)
            ->get()
            ->map(fn ($b) => [
                'leave_type' => $b->leaveType->name,
                'allocated_days' => $b->allocated_days,
                'used_days' => $b->used_days,
                'remaining_days' => $b->allocated_days - $b->used_days,
            ]);

        return $this->success($balances);
    }
}
