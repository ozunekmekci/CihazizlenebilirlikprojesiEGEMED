'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Shadcn UI Button
import { Input } from '@/components/ui/input';   // Shadcn UI Input
import { Checkbox } from '@/components/ui/checkbox'; // Shadcn UI Checkbox
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // Shadcn UI Select
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // Shadcn UI Popover
import { CalendarIcon, Loader2 } from 'lucide-react'; // Lucide Icons
import { Calendar } from '@/components/ui/calendar'; // Shadcn UI Calendar
import { format } from 'date-fns';
import { cn } from '@/lib/utils'; // Tailwind merge utility
import api from '@/lib/api'; // Merkezi API istemcisi
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Shadcn UI Table
import { toast } from 'sonner'; // For notifications

interface Department {
  id: number;
  name: string;
}

interface DeviceType {
  id: number;
  name: string;
}

interface Device {
  id: number;
  name: string;
  serial: string;
  department: Department;
  device_type: DeviceType;
  created_at: string;
  qr_printed: boolean;
}

export default function QRCodesPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedDeviceType, setSelectedDeviceType] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date } | undefined>(undefined);
  const [showUnprintedOnly, setShowUnprintedOnly] = useState<boolean>(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch departments and device types on component mount
    const fetchFilters = async () => {
      try {
        const [departmentsRes, deviceTypesRes] = await Promise.all([
          api.get('qr/departments/'),
          api.get('qr/device-types/'),
        ]);
        setDepartments(departmentsRes.data);
        setDeviceTypes(deviceTypesRes.data);
      } catch (error) {
        console.error('Error fetching filter data:', error);
        toast.error('Filtre verileri yüklenirken bir hata oluştu.');
      }
    };

    fetchFilters();
  }, []);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      // Assuming a general device list API endpoint exists in devices app
      // This needs to be implemented in backend/devices/views.py
      const response = await api.get('devices/', {
        params: {
          department_id: selectedDepartment,
          device_type_id: selectedDeviceType,
          start_date: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
          end_date: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
          qr_printed: showUnprintedOnly ? false : undefined, // Backend should filter for false
        },
      });
      setDevices(response.data);
      setFilteredDevices(response.data); // Initially, filtered devices are all fetched devices
      setSelectedDevices([]); // Clear selection on new filter
    } catch (error) {
      console.error('Error fetching devices:', error);
      toast.error('Cihazlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchDevices();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDevices(filteredDevices.map((device) => device.id));
    } else {
      setSelectedDevices([]);
    }
  };

  const handleSelectDevice = (deviceId: number, checked: boolean) => {
    if (checked) {
      setSelectedDevices((prev) => [...prev, deviceId]);
    } else {
      setSelectedDevices((prev) => prev.filter((id) => id !== deviceId));
    }
  };

  const handleGeneratePdf = async () => {
    if (selectedDevices.length === 0) {
      toast.info('Lütfen etiket oluşturmak için en az bir cihaz seçin.');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post(
        'qr/generate-pdf/',
        { device_ids: selectedDevices },
        { responseType: 'blob' } // Önemli: PDF verisini blob olarak almak için
      );

      // PDF dosyasını indir
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'qr_codes.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Bellek sızıntısını önlemek için URL'i serbest bırak

      toast.success('QR Kod PDF başarıyla oluşturuldu ve indiriliyor.');
      // After successful generation, refetch devices to update qr_printed status
      fetchDevices();
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Toplu QR Kod Üretimi ve Yazdırma</h1>

      {/* Filtreleme Paneli */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Filtreleme Seçenekleri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Departman Filtresi */}
          <Select
            onValueChange={(value) => setSelectedDepartment(value === 'all' ? null : value)}
            value={selectedDepartment || 'all'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Departman Seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Departmanlar</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={String(dept.id)}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Cihaz Türü Filtresi */}
          <Select
            onValueChange={(value) => setSelectedDeviceType(value === 'all' ? null : value)}
            value={selectedDeviceType || 'all'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Cihaz Türü Seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Cihaz Türleri</SelectItem>
              {deviceTypes.map((type) => (
                <SelectItem key={type.id} value={String(type.id)}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Eklenme Tarihi Filtresi */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={'w-full justify-start text-left font-normal ' + 
                           (!dateRange ? 'text-muted-foreground' : '')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    `Başlangıç: ${format(dateRange.from, 'PPP')} - Bitiş: ${format(
                      dateRange.to,
                      'PPP'
                    )}`
                  ) : (
                    `Başlangıç: ${format(dateRange.from, 'PPP')}`
                  )
                ) : (
                  <span>Tarih Aralığı Seçin</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* QR Etiketi Olmayanlar Checkbox */}
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="unprinted-qr"
            checked={showUnprintedOnly}
            onCheckedChange={(checked: boolean) => setShowUnprintedOnly(checked)}
          />
          <label
            htmlFor="unprinted-qr"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Sadece QR Etiketi Basılmayan Cihazları Göster
          </label>
        </div>

        <Button onClick={handleFilter} disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Filtrele
        </Button>
      </div>

      {/* Cihaz Listesi ve İşlemler */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filtrelenmiş Cihazlar ({filteredDevices.length})</h2>
          <Button
            onClick={handleGeneratePdf}
            disabled={selectedDevices.length === 0 || isGenerating}
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Seçilenler İçin Yazdırılabilir Etiket Oluştur ({selectedDevices.length})
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Cihazlar Yükleniyor...</span>
          </div>
        ) : filteredDevices.length === 0 ? (
          <p className="text-center text-muted-foreground">Filtreleme kriterlerine uygun cihaz bulunamadı.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedDevices.length === filteredDevices.length && filteredDevices.length > 0}
                      onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
                      aria-label="Tümünü Seç"
                    />
                  </TableHead>
                  <TableHead>Cihaz Adı</TableHead>
                  <TableHead>Demirbaş No</TableHead>
                  <TableHead>Departman</TableHead>
                  <TableHead>Cihaz Türü</TableHead>
                  <TableHead>QR Basıldı mı?</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedDevices.includes(device.id)}
                        onCheckedChange={(checked: boolean) => handleSelectDevice(device.id, checked)}
                        aria-label={`Cihaz ${device.name} seç`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell>{device.serial}</TableCell>
                    <TableCell>{device.department?.name || 'N/A'}</TableCell>
                    <TableCell>{device.device_type?.name || 'N/A'}</TableCell>
                    <TableCell>
                      {device.qr_printed ? (
                        <span className="text-green-500">Evet</span>
                      ) : (
                        <span className="text-red-500">Hayır</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
} 