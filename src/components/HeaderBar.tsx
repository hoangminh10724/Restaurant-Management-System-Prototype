import React from 'react';
import { Staff } from '../App';
import { MapPin, ChefHat, Calendar, Bell, Search, UserCog, LogOut } from 'lucide-react';

interface HeaderBarProps {
  user: Staff | null;
  onNavigateToTableMap?: () => void;
  onNavigateToKitchen?: () => void;
  onNavigateToOnlineBooking?: () => void;
  onNavigateToManagement?: () => void;
  onLogout?: () => void;
  onToggleSettings?: () => void;
}

export default function HeaderBar({ user, onNavigateToTableMap, onNavigateToKitchen, onNavigateToOnlineBooking, onNavigateToManagement, onLogout, onToggleSettings }: HeaderBarProps) {
  return (
    <div style={{ backgroundColor: '#2563eb', padding: '16px 24px', borderBottom: '1px solid #1e40af', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onNavigateToTableMap} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', padding: '8px 12px', borderRadius: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
            <MapPin size={20} />
            <span>Sơ đồ</span>
          </button>
          <button onClick={onNavigateToKitchen} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', padding: '8px 12px', borderRadius: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
            <ChefHat size={20} />
            <span>Bếp</span>
          </button>
          <button onClick={onNavigateToOnlineBooking} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', padding: '8px 12px', borderRadius: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
            <Calendar size={20} />
            <span>Đặt bàn Online</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
          <div style={{ position: 'relative', width: '256px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#d1d5db' }} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              style={{ width: '100%', paddingLeft: '40px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <button style={{ position: 'relative', color: 'white', padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
            <Bell size={20} />
            <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', backgroundColor: '#f87171', borderRadius: '50%' }}></span>
          </button>

          <button
            onClick={onToggleSettings}
            style={{ color: 'white', padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '14px' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            ⚙️
          </button>

          {(user && (user.role === 'Admin' || user.role === 'Quản lý')) && onNavigateToManagement && (
            <button onClick={onNavigateToManagement} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', padding: '8px 12px', borderRadius: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
              <UserCog size={20} />
              <span>Quản lý</span>
            </button>
          )}

          <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', padding: '8px 12px', borderRadius: '4px', backgroundColor: 'transparent', border: '1px solid #3b82f6', cursor: 'pointer', fontSize: '14px', fontWeight: '500', marginLeft: '8px' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      <div style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: '#1e3a8a', fontSize: '12px', color: '#dbeafe', borderTop: '1px solid #1e40af', marginTop: '12px' }}>
        Xin chào, <span style={{ fontWeight: 'bold' }}>{user?.name ?? 'Khách'}</span> ({user?.role ?? ''})
      </div>
    </div>
  );
}
