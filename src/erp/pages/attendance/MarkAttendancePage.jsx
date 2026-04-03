import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useCourseStore from '../../stores/courseStore';
import useStudentStore from '../../stores/studentStore';
import useAttendanceStore from '../../stores/attendanceStore';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import { format } from 'date-fns';
import { Check, X, Clock, Sun, Users } from 'lucide-react';

const MarkAttendancePage = () => {
  const { batches, fetchBatches, isLoadingBatches: batchesLoading } = useCourseStore();
  const { students, fetchStudents, isLoading: studentsLoading } = useStudentStore();
  const { markAttendance, isLoading } = useAttendanceStore();

  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  // Local state for tracking attendance marking before submission
  // { studentId: { status: 'present', remarks: '' } }
  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    fetchBatches({ status: 'ongoing' });
  }, [fetchBatches]);

  useEffect(() => {
    if (selectedBatch) {
      fetchStudents({ batch: selectedBatch, status: 'active' });
    }
  }, [selectedBatch, fetchStudents]);

  // Initialize attendance state when students load
  useEffect(() => {
    if (students.length > 0) {
      const initialData = {};
      students.forEach(student => {
        initialData[student.id] = { status: 'present', remarks: '' };
      });
      setAttendanceData(initialData);
    } else {
      setAttendanceData({});
    }
  }, [students]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks }
    }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach(student => {
      updated[student.id] = { ...attendanceData[student.id], status };
    });
    setAttendanceData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBatch || students.length === 0) return;

    const records = Object.entries(attendanceData).map(([studentId, data]) => ({
      studentId,
      ...data
    }));

    const success = await markAttendance(selectedDate, selectedBatch, records);
    if (success) {
      // Optional: Redirect or reset
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Mark Attendance" 
        subtitle="Record daily attendance for batches"
      />

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Select
            label="Select Batch"
            required
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            disabled={batchesLoading}
            options={[
              { label: 'Choose a batch...', value: '' },
              ...batches.map(b => ({
                label: `${b.name} (${b.course?.title || 'Unknown'})`,
                value: b.id
              }))
            ]}
          />
          <Input
            label="Date"
            type="date"
            required
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {selectedBatch && students.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">Student List</h3>
              <p className="text-sm text-slate-500">Total Enrolled: {students.length}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 mr-2">Mark All:</span>
              <Button size="sm" variant="outline" onClick={() => markAll('present')} className="text-green-600 border-green-200 bg-green-50 hover:bg-green-100">
                Present
              </Button>
              <Button size="sm" variant="outline" onClick={() => markAll('absent')} className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100">
                Absent
              </Button>
            </div>
          </div>

          <div className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-3">Roll No/UID</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const currentStatus = attendanceData[student.id]?.status || 'present';
                  return (
                    <tr key={student.id} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {student.uid || 'Pending'}
                      </td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {student.firstName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{student.firstName} {student.lastName}</p>
                          <p className="text-xs text-slate-500">{student.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {['present', 'absent', 'late', 'half_day'].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(student.id, status)}
                              className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${
                                currentStatus === status 
                                ? (status === 'present' ? 'bg-green-500 text-white shadow-md' : 
                                   status === 'absent' ? 'bg-red-500 text-white shadow-md' : 
                                   status === 'late' ? 'bg-yellow-500 text-white shadow-md' : 
                                   'bg-blue-500 text-white shadow-md')
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                              }`}
                              title={status.charAt(0).toUpperCase() + status.slice(1)}
                            >
                              {status === 'present' && <Check className="w-4 h-4" />}
                              {status === 'absent' && <X className="w-4 h-4" />}
                              {status === 'late' && <Clock className="w-4 h-4" />}
                              {status === 'half_day' && <Sun className="w-4 h-4" />}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Input
                          placeholder="Optional remarks..."
                          value={attendanceData[student.id]?.remarks || ''}
                          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t flex justify-end">
            <Button onClick={handleSubmit} isLoading={isLoading} leftIcon="save">
              Save Attendance Record
            </Button>
          </div>
        </div>
      ) : selectedBatch ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800">No students found</h3>
          <p className="text-slate-500">There are no active students enrolled in this batch.</p>
        </div>
      ) : null}
    </div>
  );
};

export default MarkAttendancePage;
