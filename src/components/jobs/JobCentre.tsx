import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { BriefcaseIcon, MapPinIcon, ClockIcon, SearchIcon, FilterIcon } from '../ui/Icons';

type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
type JobCategory = 'retail' | 'hospitality' | 'admin' | 'construction' | 'healthcare' | 'education' | 'technology' | 'general';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: JobType;
    category: JobCategory;
    salary: string;
    description: string;
    requirements: string[];
    postedAt: string;
    contactEmail: string;
    contactPhone?: string;
}

const categoryLabels: Record<JobCategory, string> = {
    retail: 'Retail', hospitality: 'Hospitality', admin: 'Admin & Office',
    construction: 'Construction', healthcare: 'Healthcare', education: 'Education',
    technology: 'Technology', general: 'General',
};

const typeLabels: Record<JobType, string> = {
    'full-time': 'Full-Time', 'part-time': 'Part-Time', contract: 'Contract', internship: 'Internship',
};

const typeColors: Record<JobType, string> = {
    'full-time': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'part-time': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    contract: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    internship: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const sampleJobs: Job[] = [
    {
        id: '1', title: 'Cashier', company: 'Shoprite', location: 'Midrand',
        type: 'full-time', category: 'retail', salary: 'R4,500 - R6,000/month',
        description: 'Shoprite is hiring friendly and reliable cashiers for our Midrand branch. Handle customer transactions, maintain a clean checkout area, and provide excellent customer service.',
        requirements: ['Grade 12 / Matric certificate', 'Basic maths skills', 'Customer service experience preferred', 'Able to work weekends and shifts'],
        postedAt: '2026-04-09T08:00:00Z', contactEmail: 'jobs@shoprite-midrand.co.za', contactPhone: '011 234 5678',
    },
    {
        id: '2', title: 'Security Guard', company: 'Fidelity ADT', location: 'Johannesburg',
        type: 'full-time', category: 'general', salary: 'R5,200 - R7,000/month',
        description: 'Fidelity ADT seeks security guards for commercial sites in the Johannesburg area. Patrol premises, monitor CCTV, and ensure safety of staff and visitors.',
        requirements: ['PSIRA Grade C or higher', 'Clear criminal record', 'Physically fit', 'Reliable transport'],
        postedAt: '2026-04-08T10:00:00Z', contactEmail: 'recruitment@fidelity-adt.co.za',
    },
    {
        id: '3', title: 'Waitron / Server', company: 'Ocean Basket', location: 'Sandton',
        type: 'part-time', category: 'hospitality', salary: 'R3,800 - R4,500/month + tips',
        description: 'Ocean Basket Sandton City is looking for energetic waitrons to join our team. Take orders, serve food and beverages, and create a memorable dining experience for guests.',
        requirements: ['Previous restaurant experience', 'Good communication skills', 'Available for evening and weekend shifts', 'Neat and presentable'],
        postedAt: '2026-04-08T14:00:00Z', contactEmail: 'sandton@oceanbasket.co.za',
    },
    {
        id: '4', title: 'Administrative Clerk', company: 'City of Johannesburg', location: 'Johannesburg CBD',
        type: 'full-time', category: 'admin', salary: 'R8,000 - R12,000/month',
        description: 'The City of Johannesburg is hiring administrative clerks for the municipal offices. Data entry, filing, answering phones, and assisting the public with queries and applications.',
        requirements: ['Grade 12 with typing skills', 'Computer literate (MS Office)', 'Good written and verbal communication', 'South African citizen'],
        postedAt: '2026-04-07T09:00:00Z', contactEmail: 'hr@joburg.org.za', contactPhone: '011 407 7000',
    },
    {
        id: '5', title: 'Construction Labourer', company: 'WBHO Construction', location: 'Centurion',
        type: 'contract', category: 'construction', salary: 'R180 - R250/day',
        description: 'WBHO Construction needs labourers for a residential building project in Centurion. Assist with site preparation, material handling, and general construction tasks.',
        requirements: ['Physical fitness', 'Willingness to work outdoors', 'Basic construction knowledge helpful', 'Own safety boots preferred'],
        postedAt: '2026-04-06T07:00:00Z', contactEmail: 'sites@wbho.co.za',
    },
    {
        id: '6', title: 'Nursing Assistant', company: 'Netcare Hospital', location: 'Pretoria',
        type: 'full-time', category: 'healthcare', salary: 'R7,500 - R10,000/month',
        description: 'Netcare Hospital Pretoria seeks caring nursing assistants to support patient care. Assist nurses with daily patient routines, take vital signs, and maintain ward hygiene.',
        requirements: ['Nursing auxiliary certificate', 'SANC registration', 'Compassionate and patient', 'Shift work availability'],
        postedAt: '2026-04-05T11:00:00Z', contactEmail: 'careers@netcare.co.za', contactPhone: '012 354 6000',
    },
    {
        id: '7', title: 'Packer / Shelf Packer', company: 'Pick n Pay', location: 'Soweto',
        type: 'part-time', category: 'retail', salary: 'R3,200 - R4,000/month',
        description: 'Pick n Pay Soweto is hiring packers for our busy store. Pack groceries for customers, restock shelves, keep the store neat and organised, and assist shoppers as needed.',
        requirements: ['Grade 10 minimum', 'Physically able to lift boxes', 'Friendly and helpful', 'Available for flexible hours'],
        postedAt: '2026-04-04T08:00:00Z', contactEmail: 'soweto@picknpay.co.za',
    },
    {
        id: '8', title: 'IT Intern', company: 'Vodacom', location: 'Midrand',
        type: 'internship', category: 'technology', salary: 'R6,000 - R8,000/month stipend',
        description: 'Vodacom offers a 12-month IT internship at their Midrand campus. Gain experience in network support, helpdesk operations, and enterprise systems while being mentored by senior engineers.',
        requirements: ['Diploma or degree in IT / Computer Science', 'Basic networking knowledge', 'South African youth (18-35)', 'Eager to learn'],
        postedAt: '2026-04-03T09:00:00Z', contactEmail: 'internships@vodacom.co.za',
    },
    {
        id: '9', title: 'Teacher Assistant', company: 'Curro Schools', location: 'Centurion',
        type: 'full-time', category: 'education', salary: 'R6,500 - R9,000/month',
        description: 'Curro Centurion is looking for a teacher assistant for the foundation phase. Support classroom activities, supervise learners during breaks, and prepare learning materials.',
        requirements: ['ECD or education qualification', 'First aid certificate preferred', 'Patient with young children', 'Clear criminal record'],
        postedAt: '2026-04-02T10:00:00Z', contactEmail: 'centurion@curro.co.za', contactPhone: '012 662 0000',
    },
    {
        id: '10', title: 'Petrol Attendant', company: 'Engen Garage', location: 'Randburg',
        type: 'full-time', category: 'general', salary: 'R4,000 - R5,500/month',
        description: 'Engen Randburg is hiring petrol attendants. Pump fuel, check oil and water, clean windscreens, and offer friendly service to every customer who visits the forecourt.',
        requirements: ['Grade 10 minimum', 'Reliable and punctual', 'Able to work shifts including weekends', 'Good communication skills'],
        postedAt: '2026-04-01T06:00:00Z', contactEmail: 'randburg@engen.co.za',
    },
];

export default function JobCentre() {
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<JobCategory | 'all'>('all');
    const [typeFilter, setTypeFilter] = useState<JobType | 'all'>('all');
    const [expandedJob, setExpandedJob] = useState<string | null>(null);

    const filtered = sampleJobs.filter(job => {
        const matchesSearch = search === '' ||
            job.title.toLowerCase().includes(search.toLowerCase()) ||
            job.company.toLowerCase().includes(search.toLowerCase()) ||
            job.location.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || job.category === categoryFilter;
        const matchesType = typeFilter === 'all' || job.type === typeFilter;
        return matchesSearch && matchesCategory && matchesType;
    });

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Job Centre</h1>
                    <p className="text-sm text-text-light mt-1">
                        Find job opportunities near {user?.town}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="badge badge-primary">{filtered.length} jobs</span>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search jobs by title, company, or location..."
                    className="input pl-10"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-1 text-xs text-text-muted mr-1">
                    <FilterIcon size={12} />
                    <span>Category:</span>
                </div>
                {(['all', ...Object.keys(categoryLabels)] as const).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat as any)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${categoryFilter === cat ? 'bg-primary text-white' : 'bg-surface-dark text-text-light hover:bg-border'}`}
                    >
                        {cat === 'all' ? 'All' : categoryLabels[cat as JobCategory]}
                    </button>
                ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
                <div className="flex items-center gap-1 text-xs text-text-muted mr-1">
                    <FilterIcon size={12} />
                    <span>Type:</span>
                </div>
                {(['all', ...Object.keys(typeLabels)] as const).map(t => (
                    <button
                        key={t}
                        onClick={() => setTypeFilter(t as any)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${typeFilter === t ? 'bg-primary text-white' : 'bg-surface-dark text-text-light hover:bg-border'}`}
                    >
                        {t === 'all' ? 'All Types' : typeLabels[t as JobType]}
                    </button>
                ))}
            </div>

            {/* Job Listings */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="card text-center py-12">
                        <BriefcaseIcon size={40} className="mx-auto text-text-muted mb-4" />
                        <h3 className="font-bold mb-2">No jobs found</h3>
                        <p className="text-sm text-text-light">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    filtered.map(job => {
                        const isExpanded = expandedJob === job.id;
                        return (
                            <div
                                key={job.id}
                                className="card cursor-pointer hover:border-primary/30 transition-all"
                                onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <BriefcaseIcon size={20} className="text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="font-semibold text-sm">{job.title}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${typeColors[job.type]}`}>
                                                {typeLabels[job.type]}
                                            </span>
                                            <span className="badge badge-secondary text-[10px]">{categoryLabels[job.category]}</span>
                                        </div>
                                        <p className="text-sm font-medium text-text-light">{job.company}</p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                                            <span className="flex items-center gap-1"><MapPinIcon size={12} />{job.location}</span>
                                            <span>{job.salary}</span>
                                            <span className="flex items-center gap-1"><ClockIcon size={12} />{new Date(job.postedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</span>
                                        </div>

                                        {isExpanded && (
                                            <div className="mt-4 pt-4 border-t border-border">
                                                <p className="text-sm mb-3">{job.description}</p>
                                                <div className="mb-3">
                                                    <h4 className="text-xs font-semibold uppercase text-text-muted mb-2">Requirements</h4>
                                                    <ul className="space-y-1">
                                                        {job.requirements.map((req, i) => (
                                                            <li key={i} className="text-xs text-text-light flex items-start gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                                                                {req}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="bg-surface-dark rounded-lg p-3">
                                                    <h4 className="text-xs font-semibold uppercase text-text-muted mb-2">How to Apply</h4>
                                                    <p className="text-xs text-text-light">
                                                        Email your CV to <span className="font-medium text-primary">{job.contactEmail}</span>
                                                        {job.contactPhone && <> or call <span className="font-medium">{job.contactPhone}</span></>}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
