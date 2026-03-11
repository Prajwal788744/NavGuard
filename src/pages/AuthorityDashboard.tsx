import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, SOSAlert } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { Users, ShieldCheck, AlertTriangle, MapPin, Phone, User, Droplets, Globe, X, CheckCircle2, Clock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  idUploaded?: boolean;
  blockchainId?: string;
  phone?: string;
  nationality?: string;
  emergencyContact?: string;
  bloodGroup?: string;
}

const AuthorityDashboard = () => {
  const { t } = useTranslation();
  const { user, loading, getSOSAlerts, resolveSOSAlert, getAllUsers } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [selectedUser, setSelectedUser] = useState<RegisteredUser | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (loading) return; // Wait for auth to finish loading
    if (!user || !user.isAdmin) { navigate('/login'); return; }

    const fetchData = async () => {
      const u = await getAllUsers();
      const a = await getSOSAlerts();
      setUsers(u);
      setAlerts(a);
    };

    fetchData();
  }, [user, loading, refreshKey]);

  // Auto-refresh every 5s for SOS alerts
  useEffect(() => {
    const interval = setInterval(() => setRefreshKey(k => k + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleResolve = async (alertId: string) => {
    await resolveSOSAlert(alertId);
    setRefreshKey(k => k + 1);
  };

  // Show loading spinner while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const activeAlerts = alerts.filter(a => !a.resolved);
  const verifiedCount = users.filter(u => u.idUploaded).length;

  const statCards = [
    { icon: Users, label: t('total_users'), value: users.length, color: 'text-cyber-teal' },
    { icon: ShieldCheck, label: t('verified_users'), value: verifiedCount, color: 'text-primary' },
    { icon: AlertTriangle, label: t('active_sos'), value: activeAlerts.length, color: 'text-destructive' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBack />
      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        <motion.h1 className="text-2xl font-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {t('authority_dashboard')}
        </motion.h1>
        <p className="text-muted-foreground text-sm">{t('monitor_users')}</p>

        <div className="grid grid-cols-3 gap-3">
          {statCards.map((s, i) => (
            <motion.div key={i} className="glass-card glow-border p-4 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <s.icon className={`mx-auto mb-2 ${s.color}`} size={24} />
              <p className="text-2xl font-black">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="alerts" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="alerts" className="flex-1 gap-1">
              <AlertTriangle size={14} />
              {t('sos_alerts')} {activeAlerts.length > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground text-xs">{activeAlerts.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-1 gap-1">
              <Users size={14} />
              {t('all_users')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-3 mt-4">
            {alerts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">{t('no_sos_alerts')}</p>
            ) : (
              alerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  className={`glass-card p-4 space-y-3 ${!alert.resolved ? 'glow-border border-destructive/30' : 'opacity-60'}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={18} className={!alert.resolved ? 'text-destructive' : 'text-muted-foreground'} />
                      <div>
                        <p className="font-bold text-sm">{alert.users?.name || 'Unknown User'}</p>
                        <p className="text-xs text-muted-foreground">{alert.users?.email || 'N/A'}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${!alert.resolved
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-primary/10 text-primary'
                      }`}>
                      {!alert.resolved ? t('active') : t('resolved')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock size={12} />
                      {new Date(alert.created_at).toLocaleString()}
                    </div>
                    {alert.latitude && alert.longitude && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin size={12} />
                        {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                      </div>
                    )}
                    {alert.video_url && (
                      <div className="col-span-2 flex items-center gap-1 text-blue-500 hover:underline cursor-pointer">
                        <User size={12} />
                        <a href={alert.video_url} target="_blank" rel="noopener noreferrer">View Video Evidence</a>
                      </div>
                    )}
                    {alert.audio_url && (
                      <div className="col-span-2 flex items-center gap-1 text-blue-500 hover:underline cursor-pointer">
                        <User size={12} />
                        <a href={alert.audio_url} target="_blank" rel="noopener noreferrer">Listen to Audio Evidence</a>
                      </div>
                    )}
                  </div>

                  {alert.latitude && alert.longitude && (
                    <a
                      href={`https://maps.google.com/?q=${alert.latitude},${alert.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center text-xs bg-accent/10 text-accent py-2 rounded-lg font-medium hover:bg-accent/20 transition-colors"
                    >
                      {t('view_on_map')}
                    </a>
                  )}

                  {!alert.resolved && (
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="w-full flex items-center justify-center gap-1 text-xs bg-primary/10 text-primary py-2 rounded-lg font-medium hover:bg-primary/20 transition-colors"
                    >
                      <CheckCircle2 size={14} /> {t('mark_resolved')}
                    </button>
                  )}
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-3 mt-4">
            {users.map((u, i) => (
              <motion.div
                key={u.id}
                className="glass-card glow-border p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedUser(selectedUser?.id === u.id ? null : u)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {u.idUploaded ? (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                        <ShieldCheck size={12} /> {t('verified')}
                      </span>
                    ) : (
                      <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">{t('unverified')}</span>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {selectedUser?.id === u.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone size={12} />
                          <span>{u.phone || '—'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Globe size={12} />
                          <span>{u.nationality || '—'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Users size={12} />
                          <span>EC: {u.emergencyContact || '—'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Droplets size={12} />
                          <span>{u.bloodGroup || '—'}</span>
                        </div>
                        {u.blockchainId && (
                          <div className="col-span-2 flex items-center gap-1.5 text-muted-foreground">
                            <ShieldCheck size={12} />
                            <span>{u.blockchainId}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            {users.length === 0 && (
              <p className="text-center text-muted-foreground py-8">{t('no_users')}</p>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AuthorityDashboard;
