<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'employees.view', 'employees.create', 'employees.edit', 'employees.delete',
            'attendance.view', 'attendance.manage',
            'leaves.view', 'leaves.approve',
            'payroll.view', 'payroll.manage',
            'reports.view',
            'settings.manage',
        ];

        foreach ($permissions as $name) {
            Permission::firstOrCreate(['name' => $name], ['label' => ucwords(str_replace(['.', '_'], [' ', ' '], $name))]);
        }

        $roles = [
            'super_admin' => ['label' => 'Super Admin', 'permissions' => $permissions],
            'admin' => ['label' => 'Admin', 'permissions' => $permissions],
            'hr_manager' => ['label' => 'HR Manager', 'permissions' => [
                'employees.view', 'employees.create', 'employees.edit',
                'attendance.view', 'attendance.manage',
                'leaves.view', 'leaves.approve',
                'payroll.view', 'payroll.manage',
                'reports.view',
            ]],
            'hr_staff' => ['label' => 'HR Staff', 'permissions' => [
                'employees.view', 'employees.create', 'employees.edit',
                'attendance.view', 'attendance.manage',
                'leaves.view',
            ]],
            'manager' => ['label' => 'Manager', 'permissions' => [
                'employees.view', 'attendance.view', 'leaves.view', 'leaves.approve', 'reports.view',
            ]],
            'employee' => ['label' => 'Employee', 'permissions' => [
                'attendance.view', 'leaves.view',
            ]],
        ];

        foreach ($roles as $name => $config) {
            $role = Role::firstOrCreate(['name' => $name], ['label' => $config['label']]);
            $permissionIds = Permission::whereIn('name', $config['permissions'])->pluck('id');
            $role->permissions()->sync($permissionIds);
        }
    }
}
