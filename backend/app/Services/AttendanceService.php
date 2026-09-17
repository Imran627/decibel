<?php

namespace App\Services;

use Carbon\Carbon;

class AttendanceService
{
    /**
     * Work hours are always derived on the backend from check-in/check-out —
     * never trust a work_hours value posted from the client.
     */
    public function computeWorkHours(?string $checkIn, ?string $checkOut): ?float
    {
        if (! $checkIn || ! $checkOut) {
            return null;
        }

        $in = Carbon::parse($checkIn);
        $out = Carbon::parse($checkOut);

        if ($out->lte($in)) {
            return null;
        }

        return round($in->diffInMinutes($out) / 60, 2);
    }

    public function computeOvertime(float $workHours, float $standardHours = 8.0): float
    {
        return $workHours > $standardHours ? round($workHours - $standardHours, 2) : 0.0;
    }
}
