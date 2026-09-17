<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Department::withCount('employees');

        if ($request->boolean('active_only')) {
            $query->where('is_active', true);
        }

        return $this->success($query->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150', 'unique:departments,name'],
            'description' => ['nullable', 'string'],
        ]);

        $department = Department::create($data);

        return $this->success($department, 'Department created successfully', 201);
    }

    public function update(Request $request, Department $department)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150', 'unique:departments,name,' . $department->id],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $department->update($data);

        return $this->success($department, 'Department updated successfully');
    }

    public function destroy(Department $department)
    {
        if ($department->employees()->exists()) {
            return $this->fail('Cannot delete a department that still has employees assigned.', 422);
        }

        $department->delete();

        return $this->success(null, 'Department deleted successfully');
    }
}
