import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { HeartIcon, MapPinIcon, SearchIcon, FilterIcon, PhoneIcon, StarIcon } from '../ui/Icons';

type Section = 'aid' | 'deals';

const aidLocations = [
    { id: 1, name: 'Johannesburg Food Bank', type: 'Food Bank', address: '123 Main St, Johannesburg', verified: true, description: 'Free food parcels distributed every Tuesday and Thursday from 9am-2pm.', phone: '011-555-0101' },
    { id: 2, name: 'Ubuntu Community Kitchen', type: 'Community Kitchen', address: '45 Hope Ave, Soweto', verified: true, description: 'Hot meals served daily for those in need. Breakfast 7-9am, Lunch 12-2pm.', phone: '011-555-0202' },
    { id: 3, name: 'St. Mary\'s Outreach', type: 'NGO', address: '78 Church Rd, Sandton', verified: true, description: 'Clothing donations, food parcels, and counseling services available.', phone: '011-555-0303' },
    { id: 4, name: 'Red Cross SA - JHB', type: 'NGO', address: '90 Relief Blvd, Midrand', verified: true, description: 'Emergency relief, first aid training, and community health services.', phone: '011-555-0404' },
    { id: 5, name: 'Harvest of Hope', type: 'Food Garden', address: '22 Green St, Centurion', verified: true, description: 'Community garden providing fresh produce to families in need every Saturday.', phone: '012-555-0505' },
];

const localDeals = [
    { id: 1, store: 'FreshMart Grocery', deal: '50% off bread after 6pm', category: 'Groceries', validUntil: 'Daily', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=120&fit=crop' },
    { id: 2, store: 'GreenLeaf Pharmacy', deal: 'Buy 2 Get 1 Free on vitamins', category: 'Health', validUntil: '30 Apr 2026', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=120&fit=crop' },
    { id: 3, store: 'QuickFix Auto', deal: 'Free vehicle check-up this month', category: 'Automotive', validUntil: '30 Apr 2026', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&h=120&fit=crop' },
    { id: 4, store: 'EcoClean Laundry', deal: '30% off dry cleaning', category: 'Services', validUntil: '15 Apr 2026', image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=200&h=120&fit=crop' },
    { id: 5, store: 'BookWorm Stationery', deal: 'Back to school — 20% off all stationery', category: 'Education', validUntil: '28 Apr 2026', image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=200&h=120&fit=crop' },
    { id: 6, store: 'Healthy Bites Cafe', deal: 'R50 lunch special — burger + drink', category: 'Food', validUntil: 'Weekdays', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&h=120&fit=crop' },
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

    const filteredAid = aidLocations.filter(a =>
        (aidTypeFilter === 'All' || a.type === aidTypeFilter) &&
        (search === '' || a.name.toLowerCase().includes(search.toLowerCase()) || a.address.toLowerCase().includes(search.toLowerCase()))
    );

    const filteredDeals = localDeals.filter(d =>
        (dealCategoryFilter === 'All' || d.category === dealCategoryFilter) &&
        (search === '' || d.store.toLowerCase().includes(search.toLowerCase()) || d.deal.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">Community Support</h1>
            <p className="text-sm text-text-light mb-6">Find free food, aid locations, local deals, and emergency services</p>

            {/* Section Toggle */}
            <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
                <button onClick={() => setSection('aid')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${section === 'aid' ? 'bg-white shadow text-text' : 'text-text-light'}`}>
                    Free Food / Aid
                </button>
                <button onClick={() => setSection('deals')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${section === 'deals' ? 'bg-white shadow text-text' : 'text-text-light'}`}>
                    Local Deals
                </button>
            </div>

            {/* Emergency Services */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {emergencyServices.map(s => (
                    <a key={s.name} href={`tel:${s.phone}`} className="card !p-3 text-center hover:border-red-300 no-underline">
                        <PhoneIcon size={16} className="mx-auto text-red-500 mb-1" />
                        <p className="text-xs font-semibold">{s.name}</p>
                        <p className="text-[10px] text-text-muted">{s.phone}</p>
                    </a>
                ))}
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder={section === 'aid' ? 'Search aid locations...' : 'Search deals...'} className="input pl-10" />
            </div>

            {section === 'aid' && (
                <>
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {aidTypes.map(t => (
                            <button key={t} onClick={() => setAidTypeFilter(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${aidTypeFilter === t ? 'bg-primary text-white' : 'bg-gray-100 text-text-light hover:bg-gray-200'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="space-y-3">
                        {filteredAid.map(loc => (
                            <div key={loc.id} className="card flex gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                                    <HeartIcon size={20} className="text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-semibold text-sm">{loc.name}</h3>
                                            <div className="flex items-center gap-1 text-xs text-text-light mt-0.5">
                                                <MapPinIcon size={12} />
                                                <span>{loc.address}</span>
                                            </div>
                                        </div>
                                        {loc.verified && <span className="badge badge-primary shrink-0">Verified</span>}
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
                </>
            )}

            {section === 'deals' && (
                <>
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {dealCategories.map(c => (
                            <button key={c} onClick={() => setDealCategoryFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${dealCategoryFilter === c ? 'bg-primary text-white' : 'bg-gray-100 text-text-light hover:bg-gray-200'}`}>
                                {c}
                            </button>
                        ))}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDeals.map(deal => (
                            <div key={deal.id} className="card !p-0 overflow-hidden">
                                <img src={deal.image} alt={deal.store} className="w-full h-32 object-cover" />
                                <div className="p-4">
                                    <span className="badge badge-accent text-[10px] mb-2">{deal.category}</span>
                                    <h3 className="font-semibold text-sm">{deal.store}</h3>
                                    <p className="text-sm text-primary font-medium mt-1">{deal.deal}</p>
                                    <p className="text-xs text-text-muted mt-2">Valid: {deal.validUntil}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
