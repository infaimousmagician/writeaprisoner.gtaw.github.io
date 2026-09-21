import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Upload, 
  ShieldAlert, 
  Check, 
  AlertCircle, 
  Building2, 
  Image as ImageIcon,
  Heart,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { InmateProfile, FacilityName, ConvictionCategory, SeekingIntent } from '../types';
import { PRESET_AVATARS } from '../data/mockInmates';

interface SubmitProfileModalProps {
  onClose: () => void;
  onSubmitSuccess: (newProfile: InmateProfile) => void;
}

export const SubmitProfileModal: React.FC<SubmitProfileModalProps> = ({
  onClose,
  onSubmitSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [moniker, setMoniker] = useState('');
  const [bookingNumber, setBookingNumber] = useState('');
  const [facility, setFacility] = useState<FacilityName>('Bolingbroke State Penitentiary - Maximum');
  const [securityLevel, setSecurityLevel] = useState<'Minimum' | 'Medium' | 'Maximum' | 'SuperMax'>('Maximum');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Non-Binary'>('Male');
  const [age, setAge] = useState<number>(25);
  const [dateOfBirth, setDateOfBirth] = useState('2001-05-15');
  const [ethnicity, setEthnicity] = useState('');
  const [hometown, setHometown] = useState('Davis, Los Santos');

  // Physical stats
  const [height, setHeight] = useState("5'11\"");
  const [weight, setWeight] = useState('180 lbs');
  const [hairColor, setHairColor] = useState('Black');
  const [eyeColor, setEyeColor] = useState('Brown');
  const [astrologicalSign, setAstrologicalSign] = useState('Taurus');
  const [religion, setReligion] = useState('Christian');
  const [sexualOrientation, setSexualOrientation] = useState('Straight');
  const [maritalStatus, setMaritalStatus] = useState('Single');

  // Offense
  const [conviction, setConviction] = useState('');
  const [convictionCategory, setConvictionCategory] = useState<ConvictionCategory>('Robbery / Theft');
  const [sentence, setSentence] = useState('8 Years');
  const [incarceratedSince, setIncarceratedSince] = useState('2024');
  const [paroleEligibility, setParoleEligibility] = useState('March 2028');

  // Bio & Seeking
  const [seeking, setSeeking] = useState<SeekingIntent[]>(['Friendship', 'Pen-Pal Letters']);
  const [aboutMe, setAboutMe] = useState('');
  const [whyWriteMe, setWhyWriteMe] = useState('');
  const [hobbiesInput, setHobbiesInput] = useState('Calisthenics, Chess, Poetry, Automotive tuning');

  // Photos
  const [primaryPhoto, setPrimaryPhoto] = useState(PRESET_AVATARS[0].url);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);

  const toggleSeeking = (item: SeekingIntent) => {
    if (seeking.includes(item)) {
      setSeeking(seeking.filter(s => s !== item));
    } else {
      setSeeking([...seeking, item]);
    }
  };

  const handlePresetSelect = (idx: number, url: string) => {
    setSelectedPresetIdx(idx);
    setPrimaryPhoto(url);
    setCustomPhotoUrl('');
  };

  const handleCustomPhotoChange = (url: string) => {
    setCustomPhotoUrl(url);
    if (url.trim()) {
      setPrimaryPhoto(url.trim());
    }
  };

  const handleNext = () => {
    setError(null);
    if (currentStep === 1) {
      if (!name.trim()) {
        setError('Please enter the inmate full legal name.');
        return;
      }
      if (!bookingNumber.trim()) {
        setError('Please enter the booking number (e.g. SADCR-XXXXX).');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!conviction.trim()) {
        setError('Please specify the conviction charges.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!aboutMe.trim() || aboutMe.length < 25) {
        setError('Please write at least 25 characters for "About Me".');
        return;
      }
      if (seeking.length === 0) {
        setError('Please select at least one "Seeking" intention.');
        return;
      }
      setCurrentStep(4);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const hobbiesArray = hobbiesInput
      .split(',')
      .map(h => h.trim())
      .filter(h => h.length > 0);

    const institutionalAddress = {
      facilityName: facility.includes('Bolingbroke') ? 'Bolingbroke State Penitentiary' : facility,
      poBox: 'P.O. Box 4500, Intake Pod',
      cityStateZip: facility.includes('Sandy Shores') 
        ? 'Sandy Shores, SA 93240' 
        : facility.includes('Twin Towers') 
        ? 'Los Santos, SA 90012' 
        : 'Senora Desert, SA 93210',
    };

    const newProfile: InmateProfile = {
      id: `inmate-${Date.now()}`,
      name: name.trim(),
      moniker: moniker.trim() || undefined,
      bookingNumber: bookingNumber.trim().toUpperCase(),
      facility,
      gender,
      age: Number(age) || 25,
      dateOfBirth,
      ethnicity: ethnicity.trim() || 'Unspecified',
      hometown: hometown.trim() || 'Los Santos, SA',
      height,
      weight,
      hairColor,
      eyeColor,
      astrologicalSign,
      religion: religion.trim() || undefined,
      sexualOrientation,
      maritalStatus,
      conviction: conviction.trim(),
      convictionCategory,
      sentence: sentence.trim(),
      incarceratedSince: incarceratedSince.trim(),
      paroleEligibility: paroleEligibility.trim(),
      securityLevel,
      seeking,
      aboutMe: aboutMe.trim(),
      whyWriteMe: whyWriteMe.trim() || "Looking forward to making genuine connections with supportive pen-pals on the outside.",
      hobbies: hobbiesArray.length > 0 ? hobbiesArray : ['Reading', 'Fitness', 'Drawing'],
      institutionalAddress,
      primaryPhoto: customPhotoUrl.trim() || primaryPhoto,
      galleryPhotos: [customPhotoUrl.trim() || primaryPhoto],
      status: 'pending', // Submits into the admin moderation queue!
      featured: false,
      verifiedInmate: false,
      submittedAt: new Date().toISOString(),
      moderationNotes: 'User submitted profile awaiting administrative verification.',
    };

    onSubmitSuccess(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="submit-profile-modal"
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-300"
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif text-white">
                Post an Inmate Profile
              </h2>
              <p className="text-xs text-slate-400">
                WriteAnInmate San Andreas • Bolingbroke & LSCJ Correctional Registry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Stepper */}
        <div className="bg-slate-100 px-5 py-2.5 border-b border-slate-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
            <span className={`font-semibold flex items-center gap-1.5 ${currentStep === 1 ? 'text-amber-700' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 1 ? 'bg-amber-600 text-white' : 'bg-slate-300 text-slate-700'}`}>1</span>
              Identity & Facility
            </span>
            <span className="text-slate-300">›</span>
            <span className={`font-semibold flex items-center gap-1.5 ${currentStep === 2 ? 'text-amber-700' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 2 ? 'bg-amber-600 text-white' : 'bg-slate-300 text-slate-700'}`}>2</span>
              Charges & Sentence
            </span>
            <span className="text-slate-300">›</span>
            <span className={`font-semibold flex items-center gap-1.5 ${currentStep === 3 ? 'text-amber-700' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 3 ? 'bg-amber-600 text-white' : 'bg-slate-300 text-slate-700'}`}>3</span>
              Bio & Pen-Pal Intent
            </span>
            <span className="text-slate-300">›</span>
            <span className={`font-semibold flex items-center gap-1.5 ${currentStep === 4 ? 'text-amber-700' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 4 ? 'bg-amber-600 text-white' : 'bg-slate-300 text-slate-700'}`}>4</span>
              Photos & Review
            </span>
          </div>

          <span className="text-slate-400 font-mono hidden sm:inline">
            Step {currentStep} of 4
          </span>
        </div>

        {/* Modal Body / Steps */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Basic Booking & Identity */}
          {currentStep === 1 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Inmate Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-inmate-name"
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Marcus Cole or Isabella Rossi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Street Moniker / Nickname (Optional)
                  </label>
                  <input
                    id="input-inmate-moniker"
                    type="text"
                    value={moniker}
                    onChange={e => setMoniker(e.target.value)}
                    placeholder='e.g. "Ghost" or "Bella"'
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Booking # / Inmate ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-inmate-booking"
                    type="text"
                    required
                    value={bookingNumber}
                    onChange={e => setBookingNumber(e.target.value)}
                    placeholder="e.g. SADCR-84912"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Facility / Prison
                  </label>
                  <select
                    id="input-inmate-facility"
                    value={facility}
                    onChange={e => setFacility(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Bolingbroke State Penitentiary - Maximum">Bolingbroke State Pen (Max)</option>
                    <option value="Bolingbroke State Penitentiary - Medium">Bolingbroke State Pen (Med)</option>
                    <option value="LSCJ Twin Towers Correctional">LSCJ Twin Towers Facility</option>
                    <option value="Sandy Shores Correctional Camp">Sandy Shores Fire Camp</option>
                    <option value="Paleto Bay Detention Center">Paleto Bay Detention Center</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Security Level
                  </label>
                  <select
                    id="input-inmate-security"
                    value={securityLevel}
                    onChange={e => setSecurityLevel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Maximum">Maximum Security</option>
                    <option value="Medium">Medium Security</option>
                    <option value="Minimum">Minimum Security</option>
                    <option value="SuperMax">SuperMax Custody</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="input-inmate-gender"
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Age
                  </label>
                  <input
                    id="input-inmate-age"
                    type="number"
                    min={18}
                    max={85}
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Hometown / Area
                  </label>
                  <input
                    id="input-inmate-hometown"
                    type="text"
                    value={hometown}
                    onChange={e => setHometown(e.target.value)}
                    placeholder="e.g. Davis, Vinewood, Sandy Shores"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Charges & Physical Demographics */}
          {currentStep === 2 && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Conviction Offenses / Charges <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-inmate-conviction"
                  type="text"
                  required
                  value={conviction}
                  onChange={e => setConviction(e.target.value)}
                  placeholder="e.g. Grand Theft Auto, Armed Robbery of Fleeca Bank, Syndicate Conspiracy"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Primary Offense Category
                  </label>
                  <select
                    id="input-inmate-conviction-cat"
                    value={convictionCategory}
                    onChange={e => setConvictionCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Robbery / Theft">Robbery / Theft</option>
                    <option value="Violent Crimes">Violent Crimes</option>
                    <option value="Narcotics & Smuggling">Narcotics & Smuggling</option>
                    <option value="Weapons & Firearms">Weapons & Firearms</option>
                    <option value="White Collar / Fraud">White Collar / Fraud</option>
                    <option value="Racketeering / RICO">Racketeering / RICO</option>
                    <option value="Other Offenses">Other Offenses</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Total Sentence Length
                  </label>
                  <input
                    id="input-inmate-sentence"
                    type="text"
                    value={sentence}
                    onChange={e => setSentence(e.target.value)}
                    placeholder="e.g. 7 Years or Life with Parole"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Incarcerated Since (Year)
                  </label>
                  <input
                    id="input-inmate-since"
                    type="text"
                    value={incarceratedSince}
                    onChange={e => setIncarceratedSince(e.target.value)}
                    placeholder="e.g. 2023"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Earliest Projected Parole / Release
                  </label>
                  <input
                    id="input-inmate-parole"
                    type="text"
                    value={paroleEligibility}
                    onChange={e => setParoleEligibility(e.target.value)}
                    placeholder="e.g. November 2027"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Physical Demographics */}
              <div className="pt-2 border-t border-slate-200">
                <span className="font-semibold text-slate-600 block mb-2">Physical Description</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-slate-500 block text-[11px]">Height</label>
                    <input
                      type="text"
                      value={height}
                      onChange={e => setHeight(e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block text-[11px]">Weight</label>
                    <input
                      type="text"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block text-[11px]">Hair Color</label>
                    <input
                      type="text"
                      value={hairColor}
                      onChange={e => setHairColor(e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block text-[11px]">Eye Color</label>
                    <input
                      type="text"
                      value={eyeColor}
                      onChange={e => setEyeColor(e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Bio & Seeking */}
          {currentStep === 3 && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Looking For / Seeking Intentions (Select all that apply) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Friendship', 'Romance', 'Pen-Pal Letters', 'Legal Assistance', 'Mentorship', 'Creative Exchange'] as SeekingIntent[]).map(item => (
                    <label
                      key={item}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                        seeking.includes(item)
                          ? 'bg-amber-50 border-amber-400 text-amber-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={seeking.includes(item)}
                        onChange={() => toggleSeeking(item)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  About Me / Personal Bio <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="input-inmate-about-me"
                  rows={4}
                  required
                  value={aboutMe}
                  onChange={e => setAboutMe(e.target.value)}
                  placeholder="Introduce yourself. What is your background, how do you spend your days inside Bolingbroke, what values matter to you?"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Why You Should Write Me
                </label>
                <textarea
                  id="input-inmate-why-write"
                  rows={2}
                  value={whyWriteMe}
                  onChange={e => setWhyWriteMe(e.target.value)}
                  placeholder="What kind of pen-pal connections are you hoping to form? What makes writing you special?"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Hobbies & Pastimes Behind Bars (comma-separated)
                </label>
                <input
                  id="input-inmate-hobbies"
                  type="text"
                  value={hobbiesInput}
                  onChange={e => setHobbiesInput(e.target.value)}
                  placeholder="e.g. Weightlifting, Reading Law Books, Leatherwork, Poetry, Automotive Sketching"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Photos & Review */}
          {currentStep === 4 && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800 block mb-1">
                  Select a Photo for your Inmate Profile:
                </span>
                <p className="text-[11px] text-slate-500 mb-3">
                  Choose from our curated GTA World character portraits or enter a direct image URL for your FiveM character mugshot.
                </p>

                {/* Preset Avatars Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-3">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetSelect(idx, preset.url)}
                      className={`relative aspect-3/4 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedPresetIdx === idx && !customPhotoUrl
                          ? 'border-amber-500 ring-2 ring-amber-500/30 scale-105'
                          : 'border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-0.5 text-[9px] text-slate-200 text-center truncate">
                        {preset.label.split(' - ')[1] || preset.label}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Or Custom URL */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Or Enter Custom Mugshot / Character Image URL:
                  </label>
                  <input
                    id="input-custom-photo-url"
                    type="url"
                    value={customPhotoUrl}
                    onChange={e => handleCustomPhotoChange(e.target.value)}
                    placeholder="https://images.unsplash.com/... or direct character image link"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Moderation Workflow Banner */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-amber-950 space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <FileCheck className="w-4 h-4 text-amber-600" />
                  <span>Integrated Administrator Approval System Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Upon submission, your profile will be sent to the <strong>Admin Moderation Queue</strong> with status <code className="bg-amber-100 px-1 py-0.5 rounded font-bold">pending</code>. It will be reviewed by SADCR staff before being publicly listed in the directory. You can view or test approval anytime in the Admin Approvals tab.
                </p>
              </div>

              {/* Summary Card Preview */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-white flex gap-4 items-center">
                <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-300">
                  <img src={customPhotoUrl || primaryPhoto} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-0.5 text-xs">
                  <h4 className="font-bold text-slate-900 font-serif text-sm">
                    {name} {moniker && `"${moniker}"`}
                  </h4>
                  <p className="text-slate-500">Booking: <span className="font-mono text-slate-800">{bookingNumber || 'SADCR-PENDING'}</span></p>
                  <p className="text-slate-500">Facility: {facility}</p>
                  <p className="text-slate-500">Seeking: {seeking.join(', ')}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Controls */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep - 1) as any)}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium text-xs rounded-lg hover:bg-slate-200 transition-colors"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium text-xs rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
            >
              Next Step ›
            </button>
          ) : (
            <button
              id="btn-final-submit-profile"
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Submit Profile to Moderation Queue</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
