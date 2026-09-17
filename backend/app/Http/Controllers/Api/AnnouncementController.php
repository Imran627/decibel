<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $query = Announcement::with('author:id,name')->orderByDesc('publish_date');

        if (! $request->user()->role || $request->user()->role->name === 'employee') {
            $query->where('is_published', true);
        }

        return $this->success($query->paginate(10));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'body' => ['required', 'string'],
            'publish_date' => ['nullable', 'date'],
            'is_published' => ['boolean'],
        ]);

        $data['created_by'] = $request->user()->id;
        $data['publish_date'] = $data['publish_date'] ?? now()->toDateString();

        return $this->success(Announcement::create($data), 'Announcement created successfully', 201);
    }

    public function update(Request $request, Announcement $announcement)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'body' => ['required', 'string'],
            'publish_date' => ['nullable', 'date'],
            'is_published' => ['boolean'],
        ]);

        $announcement->update($data);

        return $this->success($announcement, 'Announcement updated successfully');
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();

        return $this->success(null, 'Announcement deleted successfully');
    }
}
