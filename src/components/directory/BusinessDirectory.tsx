import React, { useState } from 'react';
import { SearchIcon, MapPinIcon, PhoneIcon, StarIcon, StoreIcon } from '../ui/Icons';

const businesses = [
    { id: 1, name: 'QuickFix Auto Repair', category: 'Automotive', rating: 4.5, reviews: 48, phone: '011-555-1001', address: '12 Main Rd, Johannesburg', description: 'Full vehicle repairs, servicing, and diagnostics.' },
    { id: 2, name: 'GreenLeaf Pharmacy', category: 'Health', rating: 4.8, reviews: 124, phone: '011-555-1002', address: '34 Oak Ave, Sandton', description: 'Prescriptions, over-the-counter meds, and health consultations.' },
    { id: 3, name: 'Bright Spark Electricians', category: 'Electrical', rating: 4.3, reviews: 32, phone: '011-555-1003', address: '56 Volt St, Centurion', description: 'Residential and commercial electrical installations and repairs.' },
    { id: 4, name: 'CleanStream Plumbing', category: 'Plumbing', rating: 4.6, reviews: 67, phone: '011-555-1004', address: '78 Water Rd, Midrand', description: 'Emergency plumbing, installations, and drain cleaning.' },
    { id: 5, name: 'FreshMart Grocery', category: 'Groceries', rating: 4.2, reviews: 210, phone: '011-555-1005', address: '90 Market St, Soweto', description: 'Fresh produce, groceries, and household essentials.' },
    { id: 6, name: 'SafeGuard Security', category: 'Security', rating: 4.7, reviews: 89, phone: '011-555-1006', address: '11 Patrol Rd, Randburg', description: 'Armed response, CCTV installation, and security patrols.' },
    { id: 7, name: 'SmartTech IT Solutions', category: 'Technology', rating: 4.4, reviews: 56, phone: '011-555-1007', address: '22 Digital Dr, Sandton', description: 'Computer repairs, networking, and IT support for businesses.' },
    { id: 8, name: 'Dr. Nkosi Family Practice', category: 'Health', rating: 4.9, reviews: 180, phone: '011-555-1008', address: '33 Care Blvd, Johannesburg', description: 'General practice, chronic disease management, and family health.' },
    { id: 9, name: 'EcoClean Laundry', category: 'Services', rating: 4.1, reviews: 42, phone: '011-555-1009', address: '44 Clean St, Centurion', description: 'Wash, dry, fold, and dry cleaning services.' },
    { id: 10, name: 'HomeStyle Furniture', category: 'Retail', rating: 4.3, reviews: 38, phone: '011-555-1010', address: '55 Décor Ave, Midrand', description: 'Affordable furniture, appliances, and home décor.' },
    { id: 11, name: 'TownTow Roadside Assist', category: 'Automotive', rating: 4.6, reviews: 95, phone: '0800-TOWME', address: '66 Highway Rd, Johannesburg', description: '24/7 towing, jumpstarts, and flat tire services.' },
    { id: 12, name: 'Vetcare Animal Clinic', category: 'Veterinary', rating: 4.8, reviews: 72, phone: '011-555-1012', address: '77 Pet Lane, Sandton', description: 'Veterinary care, vaccinations, and pet grooming.' },
];

const categories = ['All', 'Automotive', 'Health', 'Electrical', 'Plumbing', 'Groceries', 'Security', 'Technology', 'Services', 'Retail', 'Veterinary'];

export default function BusinessDirectory() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filtered = businesses.filter(b =>
        (selectedCategory === 'All' || b.category === selectedCategory) &&
        (search === '' || b.name.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase()) || b.description.toLowerCase().includes(search.toLowerCase()))
    );

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                    <StarIcon key={s} size={12} className={s <= Math.round(rating) ? 'text-amber-400' : 'text-text-muted/30'} />
                ))}
                <span className="text-xs text-text-light ml-1">{rating}</span>
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">Local Services</h1>
            <p className="text-sm text-text-light mb-6">Find trusted businesses and services in your area</p>

            {/* Search */}
            <div className="relative mb-4">
                <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search services (e.g. "auto repair", "pharmacy")...' className="input pl-10" />
            </div>

            {/* Categories */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-primary text-white' : 'bg-surface-dark text-text-light hover:bg-border'}`}
                    >{cat}</button>
                ))}
            </div>

            {/* Results */}
            <p className="text-sm text-text-light mb-3">{filtered.length} services found</p>
            <div className="space-y-3">
                {filtered.map(biz => (
                    <div key={biz.id} className="card flex gap-4">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center shrink-0">
                            <StoreIcon size={20} className="text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                                <div>
                                    <h3 className="font-semibold text-sm">{biz.name}</h3>
                                    <span className="badge badge-secondary text-[10px]">{biz.category}</span>
                                </div>
                                <div className="text-right shrink-0">
                                    {renderStars(biz.rating)}
                                    <p className="text-[10px] text-text-muted">{biz.reviews} reviews</p>
                                </div>
                            </div>
                            <p className="text-xs text-text-light mt-2">{biz.description}</p>
                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                                <div className="flex items-center gap-1 text-xs text-text-muted">
                                    <MapPinIcon size={12} />
                                    <span>{biz.address}</span>
                                </div>
                                <a href={`tel:${biz.phone}`} className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                                    <PhoneIcon size={12} />
                                    {biz.phone}
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
