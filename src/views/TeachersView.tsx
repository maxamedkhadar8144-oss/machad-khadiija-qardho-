import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Edit2,
  Trash2,
  X,
  Clock,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Teacher } from '../types';

export const TeachersView: React.FC = () => {
  const {
    teachers,
    classes,
    subjects,
    timetables,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    hasPermission,
    showToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingScheduleTeacher, setViewingScheduleTeacher] = useState<Teacher | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    teacherId: '',
    fullName: '',
    gender: 'Male' as 'Male' | 'Female',
    email: '',
    phone: '',
    qualification: '',
    specialization: '',
    employmentStatus: 'Full-time' as 'Full-time' | 'Part-time' | 'Contract',
    joinDate: '2026-09-01',
    assignedSubjectIds: [] as string[],
    assignedClassIds: [] as string[],
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    salary: 500,
  });

  const filteredTeachers = teachers.filter(
    t =>
      t.fullName.toLowerCase().includes(search.toLowerCase()) ||
      t.specialization.toLowerCase().includes(search.toLowerCase()) ||
      t.teacherId.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData({
      teacherId: `TCH-${String(teachers.length + 1).padStart(3, '0')}`,
      fullName: '',
      gender: 'Male',
      email: '',
      phone: '+252 90 ',
      qualification: 'Bachelor of Sharia / Education',
      specialization: '',
      employmentStatus: 'Full-time',
      joinDate: '2026-09-01',
      assignedSubjectIds: [],
      assignedClassIds: ['cls-1'],
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      salary: 500,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setFormData({
      teacherId: t.teacherId,
      fullName: t.fullName,
      gender: t.gender,
      email: t.email,
      phone: t.phone,
      qualification: t.qualification,
      specialization: t.specialization,
      employmentStatus: t.employmentStatus,
      joinDate: t.joinDate,
      assignedSubjectIds: t.assignedSubjectIds,
      assignedClassIds: t.assignedClassIds,
      photoUrl: t.photoUrl,
      salary: t.salary,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      showToast('Fadlan buuxi magaca iyo taleefanka macallinka', 'error');
      return;
    }

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, formData);
    } else {
      addTeacher(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Maamulka Macallimiinta (Teacher Management)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Xogta macallimiinta xarunta, maaddooyinka ay dhigaan, saacadaha iyo jadwalka shaqada
          </p>
        </div>

        {hasPermission('teachers', 'create') && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#006B68] hover:bg-[#005754] rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Kudar Macallin Cusub</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Ku raadi magac macallin, ID, ama takhasus..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006B68]"
          />
        </div>
      </div>

      {/* Teacher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map(teacher => {
          const teacherSubjects = subjects.filter(s => s.teacherId === teacher.id);
          const totalWorkloadHours = teacherSubjects.reduce((sum, s) => sum + s.creditHours, 0);

          return (
            <div
              key={teacher.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-[#006B68] transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Top Avatar & Badges */}
                <div className="flex items-start gap-4">
                  <img
                    src={teacher.photoUrl}
                    alt={teacher.fullName}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#006B68] bg-teal-50 px-1.5 py-0.5 rounded">
                        {teacher.teacherId}
                      </span>
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                        {teacher.employmentStatus}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 leading-tight truncate">
                      {teacher.fullName}
                    </h3>
                    <p className="text-xs text-[#006B68] font-medium truncate mt-0.5">
                      {teacher.specialization}
                    </p>
                  </div>
                </div>

                {/* Qualification */}
                <div className="mt-4 p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 leading-snug">
                  <span className="font-semibold text-slate-700 block">Shahaadada:</span>
                  {teacher.qualification}
                </div>

                {/* Contact and Workload */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-slate-700">{teacher.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate text-slate-700">{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      Culayska Shaqada:{' '}
                      <strong className="text-slate-800 font-mono">
                        {totalWorkloadHours} saacadood/todobaadkiiba
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Assigned Subjects Badges */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {teacherSubjects.map(sub => (
                    <span
                      key={sub.id}
                      className="text-[10px] font-semibold bg-teal-50 text-[#006B68] px-2 py-0.5 rounded border border-teal-200"
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setViewingScheduleTeacher(teacher)}
                  className="text-xs font-semibold text-[#006B68] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Jadwalka Shaqada</span>
                </button>

                <div className="flex items-center gap-1">
                  {hasPermission('teachers', 'edit') && (
                    <button
                      onClick={() => handleOpenEdit(teacher)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                      title="Wax ka beddel"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {hasPermission('teachers', 'delete') && (
                    <button
                      onClick={() => {
                        if (confirm(`Ma hubtaa inaad tirto macallinka ${teacher.fullName}?`)) {
                          deleteTeacher(teacher.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                      title="Tir macallinka"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SCHEDULE INSPECTOR MODAL */}
      {viewingScheduleTeacher && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Jadwalka Xiisadaha: {viewingScheduleTeacher.fullName}
                </h3>
                <p className="text-xs text-slate-500">
                  Dhammaan xiisadaha uu macallinku u xilsaaran yahay asbuuca
                </p>
              </div>
              <button
                onClick={() => setViewingScheduleTeacher(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Maalinta</th>
                    <th className="py-2.5 px-3">Saacadda</th>
                    <th className="py-2.5 px-3">Wakhtiga</th>
                    <th className="py-2.5 px-3">Fasalka</th>
                    <th className="py-2.5 px-3">Qolka</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {timetables
                    .filter(t => t.teacherId === viewingScheduleTeacher.id)
                    .map(slot => {
                      const cls = classes.find(c => c.id === slot.classId);
                      return (
                        <tr key={slot.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-semibold text-slate-800">{slot.day}</td>
                          <td className="py-2 px-3 font-mono font-bold">Saacadda {slot.period}</td>
                          <td className="py-2 px-3 font-mono text-slate-500">
                            {slot.startTime} – {slot.endTime}
                          </td>
                          <td className="py-2 px-3 font-semibold text-[#006B68]">
                            {cls?.name || slot.classId}
                          </td>
                          <td className="py-2 px-3 font-mono">{slot.room}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setViewingScheduleTeacher(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Xir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT TEACHER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                {editingTeacher ? 'Wax ka beddel Xogta Macallinka' : 'Diiwaangeli Macallin Cusub'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teacher ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.teacherId}
                    onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mushaharka ($/Bishii)
                  </label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={e =>
                      setFormData({ ...formData, salary: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Magaca Buuxa ee Macallinka
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tusaale: Macallin Cabdiraxmaan Cali"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telefoonka</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Takhasuska (Specialization)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Qur'aan & Tarbiyada Islaamka"
                  value={formData.specialization}
                  onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Shahaadada & Jaamacadda
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bachelor of Sharia - Jaamacadda Bariga Afrika"
                  value={formData.qualification}
                  onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Ka noqo
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#006B68] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Keydi Macallinka
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
