<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        return $this->success(Role::with('permissions')->get());
    }

    public function permissions()
    {
        return $this->success(Permission::orderBy('name')->get());
    }

    public function syncPermissions(Request $request, Role $role)
    {
        $data = $request->validate([
            'permission_ids' => ['required', 'array'],
            'permission_ids.*' => ['exists:permissions,id'],
        ]);

        $role->permissions()->sync($data['permission_ids']);

        return $this->success($role->load('permissions'), 'Permissions updated successfully');
    }
}
