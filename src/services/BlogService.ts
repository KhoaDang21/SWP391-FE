export interface Blog {
  id?: number;
  title: string;
  content: string;
  author: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = 'http://localhost:3333/api/v1/blogs';

export async function getAllBlogs(): Promise<Blog[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Lỗi lấy danh sách blog');
  const data = await res.json();
  return data.data;
}

export async function getBlogById(id: number): Promise<Blog> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Không tìm thấy blog');
  const data = await res.json();
  return data.data;
}

export async function createBlog(blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>, token: string): Promise<Blog> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(blog)
  });
  if (!res.ok) throw new Error('Lỗi tạo blog');
  const data = await res.json();
  return data.data;
}

export async function updateBlog(id: number, blog: Partial<Blog>, token: string): Promise<Blog> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(blog)
  });
  if (!res.ok) throw new Error('Lỗi cập nhật blog');
  const data = await res.json();
  return data.data;
}

export async function deleteBlog(id: number, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Lỗi xóa blog');
}
