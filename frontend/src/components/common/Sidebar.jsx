import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  User,
  Building2,
  Users,
  UserCheck,
  BookOpen,
  Box,
  DoorOpen,
  Calendar,
  FileCheck,
  BookMarked,
  Grid,
  ClipboardList,
  Ticket,
  CheckSquare,
  Award,
  FileText,
  Bell,
  Settings,
  UploadCloud,
} from 'lucide-react';
import '../../styles/layout.css';

const Sidebar = () => {
  const { role } = useAuth();

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/departments', label: 'Department', icon: Building2 },
    { to: '/faculties', label: 'Faculty', icon: Users },
    { to: '/students', label: 'Student', icon: UserCheck },
    { to: '/subjects', label: 'Subject', icon: BookOpen },
    { to: '/blocks', label: 'Block', icon: Box },
    { to: '/rooms', label: 'Room', icon: DoorOpen },
    { to: '/examination-series', label: 'Exam Series', icon: Calendar },
    { to: '/exams', label: 'Exam', icon: FileCheck },
    { to: '/student-subjects', label: 'Subject Registration', icon: BookMarked },
    { to: '/seat-allocations', label: 'Seat Allocation', icon: Grid },
    { to: '/invigilator-assignments', label: 'Invigilator Assignment', icon: ClipboardList },
    { to: '/hall-tickets', label: 'Hall Ticket', icon: Ticket },
    { to: '/attendance', label: 'Attendance', icon: CheckSquare },
    { to: '/results', label: 'Results', icon: Award },
    { to: '/bulk-import', label: 'Bulk Data Imports', icon: UploadCloud },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const facultyLinks = [
    { to: '/faculty/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/students', label: 'Students', icon: UserCheck },
    { to: '/subjects', label: 'Subjects', icon: BookOpen },
    { to: '/examination-series', label: 'Exam Series', icon: Calendar },
    { to: '/exams', label: 'Exams', icon: FileCheck },
    { to: '/invigilator-assignments', label: 'My Invigilations', icon: ClipboardList },
    { to: '/attendance', label: 'Mark Attendance', icon: CheckSquare },
    { to: '/results', label: 'Student Results', icon: Award },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/notifications', label: 'Notifications', icon: Bell },
  ];

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/student-subjects', label: 'My Registered Subjects', icon: BookMarked },
    { to: '/hall-tickets', label: 'My Hall Tickets', icon: Ticket },
    { to: '/seat-allocations', label: 'My Seat Allocations', icon: Grid },
    { to: '/attendance', label: 'My Attendance', icon: CheckSquare },
    { to: '/results', label: 'My Results', icon: Award },
    { to: '/notifications', label: 'Notifications', icon: Bell },
  ];

  const navItems = role === 'ADMIN' ? adminLinks : role === 'FACULTY' ? facultyLinks : studentLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <GraduationCap size={24} />
        </div>
        <div>
          <div className="sidebar-title">Exam System</div>
          <div className="sidebar-subtitle">{role} PORTAL</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
