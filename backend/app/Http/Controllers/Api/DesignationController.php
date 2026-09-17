<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Designation;
use Illuminate\Http\Request;

class DesignationController extends Controller
{
    public function index(Request $request)
    {
        $query = Designation::with('department')->withCount('employees');

        if ($departmentId = $request->query('department_id')) {
            $query->where('department_id', $departmentId);
        }

        return $this->success($query->orderBy('title')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'department_id' => ['nullable', 'exists:departments,id'],
        ]);

        $designation = Designation::create($data);

        return $this->success($designation, 'Designation created successfully', 201);
    }

    public function update(Request $request, Designation $designation)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $designation->update($data);

        return $this->success($designation, 'Designation updated successfully');
    }

    public function destroy(Designation $designation)
    {
        if ($designation->employees()->exists()) {
            return $this->fail('Cannot delete a designation that is still assigned to employees.', 422);
        }

        $designation->delete();

        return $this->success(null, 'Designation deleted successfully');
    }
}
