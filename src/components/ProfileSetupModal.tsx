import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadProfilePhoto } from '../services/api';
import { User, Check, AlertCircle, Loader2, Sparkles, Upload, Image as ImageIcon } from 'lucide-react';

export function ProfileSetupModal() {
  const { currentUser, createUserProfile } = useAuth();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState('');
  
  const [selectedAvatarStyle, setSelectedAvatarStyle] = useState('avataaars');
  const [avatarSource, setAvatarSource] = useState<'preset' | 'custom' | 'provider'>(currentUser?.photoURL ? 'provider' : 'preset');
  const defaultPhoto = currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'user'}`;
  const [photoURL, setPhotoURL] = useState(defaultPhoto);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAvatarPreset = (style: string) => {
    setSelectedAvatarStyle(style);
    setAvatarSource('preset');
    const seed = username.trim() || currentUser?.uid || 'ripple';
    const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
    setPhotoURL(url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadProfilePhoto(currentUser.uid, file);
      setPhotoURL(url);
      setAvatarSource('custom');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to upload photo.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createUserProfile(username, displayName, bio, photoURL);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not create profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="profile-setup-screen" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
        <div className="text-center mb-6">
          <div className="relative w-20 h-20 mx-auto mb-3">
            <img
              src={photoURL}
              alt="Avatar preview"
              className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-50 shadow-md"
              onError={() => setPhotoURL(`https://api.dicebear.com/7.x/avataaars/svg?seed=fallback`)}
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Set Up Your Profile</h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose your unique username and profile picture to start Rippling.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar style pickers */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
              Profile Picture / Avatar
            </label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              <button
                type="button"
                onClick={() => handleAvatarPreset('avataaars')}
                className={`p-2 border rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 transition ${selectedAvatarStyle === 'avataaars' ? 'border-blue-600 bg-blue-50/50 text-blue-700 ring-2 ring-blue-600/20' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
              >
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'a'}`} className="w-8 h-8 rounded-full" alt="Avataaars" />
                <span>Modern</span>
              </button>
              <button
                type="button"
                onClick={() => handleAvatarPreset('bottts')}
                className={`p-2 border rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 transition ${selectedAvatarStyle === 'bottts' ? 'border-blue-600 bg-blue-50/50 text-blue-700 ring-2 ring-blue-600/20' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
              >
                <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${username || 'b'}`} className="w-8 h-8 rounded-full" alt="Bottts" />
                <span>Robots</span>
              </button>
              <button
                type="button"
                onClick={() => handleAvatarPreset('lorelei')}
                className={`p-2 border rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 transition ${selectedAvatarStyle === 'lorelei' ? 'border-blue-600 bg-blue-50/50 text-blue-700 ring-2 ring-blue-600/20' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
              >
                <img src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${username || 'c'}`} className="w-8 h-8 rounded-full" alt="Lorelei" />
                <span>Artistic</span>
              </button>
              <button
                type="button"
                onClick={() => handleAvatarPreset('identicon')}
                className={`p-2 border rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 transition ${selectedAvatarStyle === 'identicon' ? 'border-blue-600 bg-blue-50/50 text-blue-700 ring-2 ring-blue-600/20' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
              >
                <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${username || 'd'}`} className="w-8 h-8 rounded-full" alt="Identicon" />
                <span>Geometric</span>
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full py-2 px-3 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> : <Upload className="w-4 h-4 text-slate-500" />}
                <span>{uploading ? 'Uploading...' : 'Upload Custom Image (JPEG, PNG, WebP up to 5MB)'}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Username (Unique)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-xs">@</span>
              <input
                id="setup-username-input"
                type="text"
                required
                value={username}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '');
                  setUsername(val);
                  if (avatarSource === 'preset') {
                    const seed = val.trim() || currentUser?.uid || 'user';
                    setPhotoURL(`https://api.dicebear.com/7.x/${selectedAvatarStyle}/svg?seed=${seed}`);
                  }
                }}
                placeholder="username"
                maxLength={24}
                className="w-full pl-8 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-slate-900"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Only lowercase letters, numbers, and underscores.</p>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Display Name
            </label>
            <input
              id="setup-displayname-input"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Name"
              maxLength={40}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Bio (Optional)
            </label>
            <textarea
              id="setup-bio-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others what you are curious about..."
              rows={3}
              maxLength={160}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition resize-none text-slate-900"
            />
            <div className="text-right text-[10px] text-slate-400 mt-0.5">
              {bio.length}/160
            </div>
          </div>

          <button
            id="setup-submit-button"
            type="submit"
            disabled={submitting || !username.trim()}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Complete Setup</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
