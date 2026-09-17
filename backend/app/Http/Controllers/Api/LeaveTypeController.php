<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveType;
use Illuminate\Http\Request;

class LeaveTypeController extends Controller
{
    public function index()
    {
        return $this->success(LeaveType::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:leave_types,name'],
            'default_days' => ['required', 'integer', 'min:0'],
            'is_paid' => ['boolean'],
        ]);

        $leaveType = LeaveType::create($data);

        return $this->success($leaveType, 'Leave type created successfully', 201);
    }

    public function update(Request $request, LeaveType $leaveType)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:leave_types,name,' . $leaveType->id],
            'default_days' => ['required', 'integer', 'min:0'],
            'is_paid' => ['boolean'],
        ]);

        $leaveType->update($data);

        return $this->success($leaveType, 'Leave type updated successfully');
    }

    public function destroy(LeaveType $leaveType)
    {
        $leaveType->delete();

        return $this->success(null, 'Leave type deleted successfully');
    }
}
