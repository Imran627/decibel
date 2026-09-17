<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\LeaveType;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RolesAndPermissionsSeeder::class);

        // --- Admin user ---
        $adminRole = Role::where('name', 'super_admin')->first();
        $admin = User::firstOrCreate(
            ['email' => 'admin@decibel.test'],
            ['name' => 'System Admin', 'password' => Hash::make('password'), 'role_id' => $adminRole->id]
        );

        // --- Departments & designations ---
        $departments = ['Human Resources', 'Finance', 'IT', 'Marketing', 'Sales', 'Operations'];
        $departmentModels = collect($departments)->mapWithKeys(
            fn ($name) => [$name => Department::firstOrCreate(['name' => $name])]
        );

        $designations = [
            'HR Manager' => 'Human Resources',
            'Software Developer' => 'IT',
            'UI/UX Designer' => 'IT',
            'Accountant' => 'Finance',
            'Sales Executive' => 'Sales',
            'Marketing Manager' => 'Marketing',
            'Project Manager' => 'Operations',
        ];
        $designationModels = collect($designations)->mapWithKeys(
            fn ($dept, $title) => [$title => Designation::firstOrCreate([
                'title' => $title,
            ], ['department_id' => $departmentModels[$dept]->id])]
        );

        // --- Leave types ---
        $leaveTypes = [
            ['name' => 'Annual Leave', 'default_days' => 20, 'is_paid' => true],
            ['name' => 'Sick Leave', 'default_days' => 10, 'is_paid' => true],
            ['name' => 'Casual Leave', 'default_days' => 8, 'is_paid' => true],
            ['name' => 'Unpaid Leave', 'default_days' => 0, 'is_paid' => false],
            ['name' => 'Maternity Leave', 'default_days' => 90, 'is_paid' => true],
            ['name' => 'Emergency Leave', 'default_days' => 5, 'is_paid' => true],
        ];
        foreach ($leaveTypes as $type) {
            LeaveType::firstOrCreate(['name' => $type['name']], $type);
        }

        // --- Sample HR manager employee, linked to a login user ---
        $hrRole = Role::where('name', 'hr_manager')->first();
        $hrUser = User::firstOrCreate(
            ['email' => 'hr.manager@decibel.test'],
            ['name' => 'Sana Ahmed', 'password' => Hash::make('password'), 'role_id' => $hrRole->id]
        );

        Employee::firstOrCreate(
            ['email' => 'hr.manager@decibel.test'],
            [
                'employee_code' => 'EMP-0001',
                'user_id' => $hrUser->id,
                'first_name' => 'Sana',
                'last_name' => 'Ahmed',
                'phone' => '+92 300 1234567',
                'gender' => 'female',
                'department_id' => $departmentModels['Human Resources']->id,
                'designation_id' => $designationModels['HR Manager']->id,
                'employment_type' => 'full_time',
                'joining_date' => now()->subYears(2),
                'work_location' => 'Karachi HQ',
                'salary' => 250000,
                'status' => 'active',
            ]
        );

        // --- A handful of sample employees for dashboard/list testing ---
        $sample = [
            ['first' => 'Ahmed', 'last' => 'Raza', 'dept' => 'IT', 'title' => 'Software Developer'],
            ['first' => 'Fatima', 'last' => 'Khan', 'dept' => 'Marketing', 'title' => 'Marketing Manager'],
            ['first' => 'Bilal', 'last' => 'Hussain', 'dept' => 'Sales', 'title' => 'Sales Executive'],
            ['first' => 'Ayesha', 'last' => 'Malik', 'dept' => 'Finance', 'title' => 'Accountant'],
        ];
        foreach ($sample as $i => $s) {
            Employee::firstOrCreate(
                ['email' => strtolower("{$s['first']}.{$s['last']}@decibel.test")],
                [
                    'employee_code' => 'EMP-' . str_pad((string) ($i + 2), 4, '0', STR_PAD_LEFT),
                    'first_name' => $s['first'],
                    'last_name' => $s['last'],
                    'department_id' => $departmentModels[$s['dept']]->id,
                    'designation_id' => $designationModels[$s['title']]->id,
                    'employment_type' => 'full_time',
                    'joining_date' => now()->subMonths(rand(1, 24)),
                    'work_location' => 'Karachi HQ',
                    'salary' => rand(80, 220) * 1000,
                    'status' => 'active',
                ]
            );
        }

        $this->command->info('Seeded. Login: admin@decibel.test / password');
    }
}
