export async function fetchDevices() {
  const res = await fetch('http://localhost:8000/api/devices/');
  if (!res.ok) throw new Error('Cihazlar alınamadı');
  return res.json();
}

export async function createDevice(data: any) {
  const res = await fetch('http://localhost:8000/api/devices/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Cihaz eklenemedi');
  return res.json();
}

export async function updateDevice(id: number, data: any) {
  const res = await fetch(`http://localhost:8000/api/devices/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Cihaz güncellenemedi');
  return res.json();
}

export async function deleteDevice(id: number) {
  const res = await fetch(`http://localhost:8000/api/devices/${id}/`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Cihaz silinemedi');
} 