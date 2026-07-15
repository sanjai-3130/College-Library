import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ShieldCheck, 
  GraduationCap, 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  Sparkles, 
  Droplet,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import './index.css';

const StudentCardVerify: React.FC = () => {
  // Extract URL Parameters
  const [params, setParams] = useState({
    id: 'CS-2024-4091',
    name: 'Alex Mercer',
    dept: 'Computer Science',
    year: '2025-2026',
    semester: '6th Semester',
    section: 'A',
    blood: 'O+',
    phone: '9876543210',
    email: 'alex@college.edu',
    avatar: '',
    role: 'student'
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id') || 'CS-2024-4091';
    const name = urlParams.get('name') || 'Alex Mercer';
    const dept = urlParams.get('dept') || 'Computer Science';
    const year = urlParams.get('year') || '2025-2026';
    const semester = urlParams.get('semester') || '6th Semester';
    const section = urlParams.get('section') || 'A';
    const blood = urlParams.get('blood') || 'O+';
    const phone = urlParams.get('phone') || '9876543210';
    const email = urlParams.get('email') || 'alex@college.edu';
    const avatar = urlParams.get('avatar') || '';
    const role = urlParams.get('role') || 'student';

    setParams({
      id,
      name,
      dept,
      year,
      semester,
      section,
      blood,
      phone,
      email,
      avatar,
      role: role.toLowerCase()
    });
  }, []);

  // 3D Tilt Card effect handler (Desktop Mouse Move)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate mouse position relative to the center of the card
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Normalize to max 15 degrees tilt
    const rotateX = -(mouseY / (height / 2)) * 12;
    const rotateY = (mouseX / (width / 2)) * 12;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Avatar selector with reliable Dicebear fallback based on seed name
  const avatarSrc = params.avatar.trim() 
    ? params.avatar 
    : `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(params.name || params.id)}`;

  const isStaff = params.role === 'staff' || params.role === 'admin' || params.role === 'faculty';

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 md:p-8 bg-slate-50 overflow-x-hidden selection:bg-brand-500 selection:text-white font-sans">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-brand-500/10 blur-[100px] md:blur-[150px] pointer-events-none animate-pulse duration-5000" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-indigo-500/10 blur-[100px] md:blur-[150px] pointer-events-none animate-pulse duration-7000" />

      {/* Back button link */}
      <a 
        href="/" 
        className="absolute top-4 left-4 md:top-8 md:left-8 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 z-50 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
        <span>Back to Portal</span>
      </a>

      {/* Main card stage */}
      <div className="perspective-1200 w-full flex justify-center items-center py-10">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl border border-white/50 p-6 md:p-8 rounded-3xl bento-shadow flex flex-col items-center select-none transform-gpu relative overflow-hidden"
        >
          {/* Top header glow ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 to-indigo-500" />

          {/* Institutional Branding Header */}
          <div className="flex items-center justify-center gap-3 mb-6 w-full">
            <div className="h-10 w-10 bg-gradient-to-br from-brand-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-brand-100">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight leading-tight font-display">Athena State</h2>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">University Library</span>
            </div>
          </div>

          {/* Avatar Photo Frame */}
          <div className="relative group mb-4">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-brand-400 to-indigo-400 blur-sm opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-50 flex items-center justify-center shrink-0">
              <img 
                src={avatarSrc} 
                alt={params.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Secure Verified Badge */}
          <div 
            className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm uppercase tracking-wider mb-6 ${
              isStaff 
                ? 'bg-amber-500 text-white shadow-amber-100' 
                : 'bg-emerald-500 text-white shadow-emerald-100'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>{isStaff ? 'Verified Faculty / Staff' : 'Verified Student'}</span>
          </div>

          {/* Attributes List */}
          <div className="w-full space-y-2.5 bg-slate-50/50 rounded-2xl border border-slate-200/40 p-4 mb-6">
            
            <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 text-xs">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <Award className="h-4 w-4 text-brand-500" />
                <span>Identity ID</span>
              </div>
              <span className="font-mono font-bold text-slate-800">{params.id}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 text-xs">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <User className="h-4 w-4 text-brand-500" />
                <span>Full Name</span>
              </div>
              <span className="font-bold text-slate-800 truncate max-w-[60%]">{params.name}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 text-xs">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <Layers className="h-4 w-4 text-brand-500" />
                <span>Department</span>
              </div>
              <span className="font-bold text-slate-800 truncate max-w-[60%]">{params.dept}</span>
            </div>

            {!isStaff && (
              <>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 text-xs">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Calendar className="h-4 w-4 text-brand-500" />
                    <span>Academic Year</span>
                  </div>
                  <span className="font-bold text-slate-800">{params.year}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 text-xs">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <GraduationCap className="h-4 w-4 text-brand-500" />
                    <span>Semester / Level</span>
                  </div>
                  <span className="font-bold text-slate-800">{params.semester}</span>
                </div>
              </>
            )}

            <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 text-xs">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <Droplet className="h-4 w-4 text-red-500 fill-red-500/20" />
                <span>Blood Group</span>
              </div>
              <span className="font-bold text-slate-800">{params.blood}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40 text-xs">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <Phone className="h-4 w-4 text-brand-500" />
                <span>Mobile</span>
              </div>
              <span className="font-bold text-slate-800 font-mono">{params.phone}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <Mail className="h-4 w-4 text-brand-500" />
                <span>Secure Email</span>
              </div>
              <span className="font-bold text-slate-800 truncate max-w-[55%]">{params.email}</span>
            </div>

          </div>

          {/* Verified QR Barcode pass */}
          <div className="w-full flex flex-col items-center pt-4 border-t border-slate-150">
            <div className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm mb-2.5 hover:scale-[1.03] transition-transform duration-300">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(params.id)}`} 
                alt="Verification QR code" 
                className="w-24 h-24 block object-contain"
              />
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest font-mono">
              <Sparkles className="h-3.5 w-3.5 text-brand-500 fill-brand-500/20 animate-spin duration-3000" />
              <span>Digital Verification ID</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mount the component inside the container
const rootElement = document.getElementById('new-root');
if (rootElement) {
  createRoot(rootElement).render(<StudentCardVerify />);
}
