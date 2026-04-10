import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { HeartIcon, MapPinIcon, SearchIcon, FilterIcon, PhoneIcon, StarIcon } from '../ui/Icons';

type Section = 'aid' | 'deals';

const aidLocations = [
    { id: 1, name: 'Johannesburg Food Bank', type: 'Food Bank', town: 'Johannesburg', address: '123 Main St, Johannesburg', verified: true, description: 'Free food parcels distributed every Tuesday and Thursday from 9am-2pm. Serves over 200 families weekly with staple foods and fresh produce.', phone: '011-555-0101', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=300&h=180&fit=crop' },
    { id: 2, name: 'Ubuntu Community Kitchen', type: 'Community Kitchen', town: 'Soweto', address: '45 Hope Ave, Soweto', verified: true, description: 'Hot meals served daily for those in need. Breakfast 7-9am, Lunch 12-2pm. Run by volunteer community members with donations from local businesses.', phone: '011-555-0202', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=180&fit=crop' },
    { id: 3, name: 'St. Mary\'s Outreach', type: 'NGO', town: 'Sandton', address: '78 Church Rd, Sandton', verified: true, description: 'Clothing donations, food parcels, and counseling services available. Open weekdays 8am-4pm with a walk-in support centre.', phone: '011-555-0303', image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=300&h=180&fit=crop' },
    { id: 4, name: 'Red Cross SA - JHB', type: 'NGO', town: 'Midrand', address: '90 Relief Blvd, Midrand', verified: true, description: 'Emergency relief, first aid training, and community health services. Disaster response unit active during floods and extreme weather events.', phone: '011-555-0404', image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=300&h=180&fit=crop' },
    { id: 5, name: 'Harvest of Hope', type: 'Food Garden', town: 'Centurion', address: '22 Green St, Centurion', verified: true, description: 'Community garden providing fresh produce to families in need every Saturday morning. Vegetable boxes and herb bundles available free of charge.', phone: '012-555-0505', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=180&fit=crop' },
    { id: 6, name: 'Cape Town Community Chest', type: 'NGO', town: 'Cape Town', address: '15 Darling St, Cape Town', verified: true, description: 'A trusted organization providing funding and support to local non-profits. They connect communities with food, shelter, and educational programmes.', phone: '021-555-0601', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=180&fit=crop' },
    { id: 7, name: 'Durban Soup Kitchen', type: 'Community Kitchen', town: 'Durban', address: '88 Point Rd, Durban', verified: true, description: 'Warm meals served every day from 11am to 1pm. Also offers a clothing swap programme and hygiene kits for those in need.', phone: '031-555-0701', image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=300&h=180&fit=crop' },
    { id: 8, name: 'Pretoria Food Drive', type: 'Food Bank', town: 'Pretoria', address: '34 Church Square, Pretoria', verified: true, description: 'Monthly food drives collecting and distributing non-perishable goods. Drop-off points at major shopping centres and community halls.', phone: '012-555-0801', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=300&h=180&fit=crop' },
    { id: 9, name: 'Port Elizabeth Aid Centre', type: 'NGO', town: 'Port Elizabeth', address: '12 Settlers Way, PE', verified: true, description: 'Comprehensive aid centre offering food assistance, job placement support, and educational workshops. Family counseling available on Wednesdays.', phone: '041-555-0901', image: 'https://images.unsplash.com/photo-1518398046578-8cca57782e17?w=300&h=180&fit=crop' },
    { id: 10, name: 'Bloem Community Garden', type: 'Food Garden', town: 'Bloemfontein', address: '67 President Brand St, Bloemfontein', verified: true, description: 'A thriving urban food garden open to all residents. Learn sustainable gardening techniques while growing food for families and local shelters.', phone: '051-555-1001', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300&h=180&fit=crop' },
];

const localDeals = [
    { id: 1, store: 'FreshMart Grocery', town: 'Johannesburg', deal: '50% off bread after 6pm', category: 'Groceries', validUntil: 'Daily', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=180&fit=crop' },
    { id: 2, store: 'GreenLeaf Pharmacy', town: 'Johannesburg', deal: 'Buy 2 Get 1 Free on vitamins', category: 'Health', validUntil: '30 Apr 2026', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=180&fit=crop' },
    { id: 3, store: 'QuickFix Auto', town: 'Pretoria', deal: 'Free vehicle check-up this month', category: 'Automotive', validUntil: '30 Apr 2026', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=180&fit=crop' },
    { id: 4, store: 'EcoClean Laundry', town: 'Sandton', deal: '30% off dry cleaning', category: 'Services', validUntil: '15 Apr 2026', image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=300&h=180&fit=crop' },
    { id: 5, store: 'BookWorm Stationery', town: 'Centurion', deal: 'Back to school — 20% off all stationery', category: 'Education', validUntil: '28 Apr 2026', image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=300&h=180&fit=crop' },
    { id: 6, store: 'Healthy Bites Cafe', town: 'Johannesburg', deal: 'R50 lunch special — burger + drink', category: 'Food', validUntil: 'Weekdays', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&h=180&fit=crop' },
    { id: 7, store: 'Ocean Basket Durban', town: 'Durban', deal: '2-for-1 sushi Tuesdays', category: 'Food', validUntil: 'Every Tuesday', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&h=180&fit=crop' },
    { id: 8, store: 'Table Mountain Pharmacy', town: 'Cape Town', deal: 'Free blood pressure check', category: 'Health', validUntil: 'Ongoing', image: 'https://images.unsplash.com/photo-1631549916768-4f7ea0c5ad6e?w=300&h=180&fit=crop' },
    { id: 9, store: 'Builders Express PE', town: 'Port Elizabeth', deal: '15% off all paint', category: 'Services', validUntil: '20 Apr 2026', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&h=180&fit=crop' },
    { id: 10, store: 'Varsity Food Trucks', town: 'Bloemfontein', deal: 'Student special R35 combo meal', category: 'Food', validUntil: 'Weekdays, term time', image: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=300&h=180&fit=crop' },
    { id: 11, store: 'Polokwane Greens Market', town: 'Polokwane', deal: 'Fresh organic veggies — R25 per bag', category: 'Groceries', validUntil: 'Saturdays', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=180&fit=crop' },
    { id: 12, store: 'Kimberley Auto Spa', town: 'Kimberley', deal: 'Full car wash + interior R80', category: 'Automotive', validUntil: '30 Apr 2026', image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=300&h=180&fit=crop' },
];

const dealCategories = ['All', 'Groceries', 'Health', 'Automotive', 'Services', 'Education', 'Food'];
const aidTypes = ['All', 'Food Bank', 'Community Kitchen', 'NGO', 'Food Garden'];

const emergencyServices = [
    { name: 'Closest Hospital', phone: '10177', desc: 'Emergency medical services' },
    { name: 'Tow Truck', phone: '0800-TOWME', desc: '24/7 roadside assistance' },
    { name: 'Police', phone: '10111', desc: 'South African Police Service' },
    { name: 'Fire Department', phone: '10177', desc: 'Fire & rescue services' },
];

export default function CommunitySupport() {
    const { user } = useAuth();
    const [section, setSection] = useState<Section>('aid');
    const [search, setSearch] = useState('');
    const [aidTypeFilter, setAidTypeFilter] = useState('All');
    const [dealCategoryFilter, setDealCategoryFilter] = useState('All');
    const [showAllTowns, setShowAllTowns] = useState(false);

    const filteredAid = aidLocations.filter(a =>
        (aidTypeFilter === 'All' || a.type === aidTypeFilter) &&
        (showAllTowns || a.town === user?.town || a.town === 'All') &&
        (search === '' || a.name.toLowerCase().includes(search.toLowerCase()) || a.address.toLowerCase().includes(search.toLowerCase()))
    );

    const filteredDeals = localDeals.filter(d =>
        (dealCategoryFilter === 'All' || d.category === dealCategoryFilter) &&
        (showAllTowns || d.town === user?.town || d.town === 'All') &&
        (search === '' || d.store.toLowerCase().includes(search.toLowerCase()) || d.deal.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">Community Support</h1>
            <p className="text-sm text-text-light mb-6">Find free food, aid locations, local deals, and emergency services</p>

            {/* Section Toggle */}
            <div className="flex gap-1 mb-4 bg-surface-dark rounded-lg p-1">
                <button onClick={() => setSection('aid')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${section === 'aid' ? 'bg-surface-card shadow text-text' : 'text-text-light'}`}>
                    Free Food / Aid
                </button>
                <button onClick={() => setSection('deals')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${section === 'deals' ? 'bg-surface-card shadow text-text' : 'text-text-light'}`}>
                    Local Deals
                </button>
            </div>

            {/* Emergency Services */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {emergencyServices.map(s => (
                    <a key={s.name} href={`tel:${s.phone}`} className="card !p-3 text-center hover:border-red-300 dark:hover:border-red-700 no-underline">
                        <PhoneIcon size={16} className="mx-auto text-red-500 mb-1" />
                        <p className="text-xs font-semibold">{s.name}</p>
                        <p className="text-[10px] text-text-muted">{s.phone}</p>
                    </a>
                ))}
            </div>

            {/* Search + Town Toggle */}
            <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                    <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder={section === 'aid' ? 'Search aid locations...' : 'Search deals...'} className="input pl-10" />
                </div>
                <button onClick={() => setShowAllTowns(!showAllTowns)} className={`btn btn-sm whitespace-nowrap ${showAllTowns ? 'btn-primary' : 'btn-outline'}`}>
                    {showAllTowns ? 'All Towns' : 'My Town'}
                </button>
            </div>

            {section === 'aid' && (
                <>
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {aidTypes.map(t => (
                            <button key={t} onClick={() => setAidTypeFilter(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${aidTypeFilter === t ? 'bg-primary text-white' : 'bg-surface-dark text-text-light hover:bg-border'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                    {filteredAid.length === 0 ? (
                        <div className="card text-center py-8">
                            <HeartIcon size={32} className="mx-auto text-text-muted mb-3" />
                            <p className="text-sm text-text-light">No aid locations found for your area. Try showing all towns.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredAid.map(loc => (
                                <div key={loc.id} className="card flex gap-4">
                                    <img src={loc.image} alt={loc.name} className="w-20 h-20 rounded-lg object-cover shrink-0 hidden sm:block" loading="lazy" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="font-semibold text-sm">{loc.name}</h3>
                                                <div className="flex items-center gap-1 text-xs text-text-light mt-0.5">
                                                    <MapPinIcon size={12} />
                                                    <span>{loc.address}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                {loc.verified && <span className="badge badge-primary">Verified</span>}
                                                <span className="badge badge-secondary text-[10px]">{loc.type}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-text-light mt-2">{loc.description}</p>
                                        <a href={`tel:${loc.phone}`} className="inline-flex items-center gap-1 mt-2 text-xs text-primary font-medium">
                                            <PhoneIcon size={12} />
                                            {loc.phone}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {section === 'deals' && (
                <>
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {dealCategories.map(c => (
                            <button key={c} onClick={() => setDealCategoryFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${dealCategoryFilter === c ? 'bg-primary text-white' : 'bg-surface-dark text-text-light hover:bg-border'}`}>
                                {c}
                            </button>
                        ))}
                    </div>
                    {filteredDeals.length === 0 ? (
                        <div className="card text-center py-8">
                            <StarIcon size={32} className="mx-auto text-text-muted mb-3" />
                            <p className="text-sm text-text-light">No deals found for your area. Try showing all towns.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredDeals.map(deal => (
                                <div key={deal.id} className="card !p-0 overflow-hidden">
                                    <img src={deal.image} alt={deal.store} className="w-full h-36 object-cover" loading="lazy" />
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="badge badge-accent text-[10px]">{deal.category}</span>
                                            <span className="text-[10px] text-text-muted flex items-center gap-0.5"><MapPinIcon size={10} />{deal.town}</span>
                                        </div>
                                        <h3 className="font-semibold text-sm">{deal.store}</h3>
                                        <p className="text-sm text-primary font-medium mt-1">{deal.deal}</p>
                                        <p className="text-xs text-text-muted mt-2">Valid: {deal.validUntil}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
