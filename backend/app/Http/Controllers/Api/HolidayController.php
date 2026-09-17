<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Holiday;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    public function index(Request $request)
    {
        $query = Holiday::orderBy('date');

        if ($request->boolean('upcoming_only')) {
            $query->where('date', '>=', now()->toDateString());
        }

        return $this->success($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'date' => ['required', 'date'],
            'description' => ['nullable', 'string'],
        ]);

        return $this->success(Holiday::create($data), 'Holiday created successfully', 201);
    }

    public function update(Request $request, Holiday $holiday)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'date' => ['required', 'date'],
            'description' => ['nullable', 'string'],
        ]);

        $holiday->update($data);

        return $this->success($holiday, 'Holiday updated successfully');
    }

    public function destroy(Holiday $holiday)
    {
        $holiday->delete();

        return $this->success(null, 'Holiday deleted successfully');
    }
}
