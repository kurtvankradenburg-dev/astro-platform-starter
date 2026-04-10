import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { HeartIcon, MapPinIcon, SearchIcon, PhoneIcon, StarIcon, HomeIcon, AlertIcon, ShieldIcon } from '../ui/Icons';

type Section = 'aid' | 'shelters' | 'medical' | 'roadside' | 'deals';

// ─── FOOD AID ────────────────────────────────────────────────────────────────
const aidLocations = [
    // Johannesburg
    { id: 1, name: 'Johannesburg Food Bank', type: 'Food Bank', town: 'Johannesburg', address: '123 Main St, Johannesburg', verified: true, hours: 'Tue & Thu 9am–2pm', description: 'Free food parcels distributed every Tuesday and Thursday. Serves over 200 families weekly with staple foods and fresh produce. Bring your ID.', phone: '011-555-0101' },
    { id: 2, name: 'Hillbrow Soup Kitchen', type: 'Soup Kitchen', town: 'Johannesburg', address: '32 Claim St, Hillbrow', verified: true, hours: 'Daily 11am–1pm', description: 'Hot nutritious soup and bread served to all in need. No questions asked. Also distributes hygiene kits on Fridays.', phone: '011-642-1100' },
    { id: 3, name: 'Bertrams Community Meals', type: 'Soup Kitchen', town: 'Johannesburg', address: '7 Albertina Sisulu Rd, Bertrams', verified: true, hours: 'Mon–Fri 12pm–2pm', description: 'Volunteer-run kitchen serving 150+ meals daily. Provides hot food and beverages to homeless and low-income residents.', phone: '011-614-3300' },
    { id: 4, name: 'Diepsloot Food Pantry', type: 'Food Bank', town: 'Johannesburg', address: 'Ext 1 Community Hall, Diepsloot', verified: true, hours: 'Wed 8am–12pm', description: 'Weekly food parcel distribution serving Diepsloot Extension 1–6 residents. Includes maize meal, beans, cooking oil and canned goods.', phone: '011-794-5500' },
    { id: 5, name: 'Alexandra Community Kitchen', type: 'Community Kitchen', town: 'Johannesburg', address: '10th Ave, Alexandra', verified: true, hours: 'Daily 7am–9am & 12pm–2pm', description: 'Breakfast and lunch served daily to Alexandra township residents. Run by local church volunteers in partnership with local businesses.', phone: '011-443-7700' },
    // Soweto
    { id: 6, name: 'Ubuntu Community Kitchen', type: 'Community Kitchen', town: 'Soweto', address: '45 Hope Ave, Soweto', verified: true, hours: 'Daily 7am–2pm', description: 'Hot meals served daily for those in need. Breakfast 7–9am, Lunch 12–2pm. Run by volunteer community members with donations from local businesses.', phone: '011-555-0202' },
    { id: 7, name: 'Soweto Soup Kitchen Network', type: 'Soup Kitchen', town: 'Soweto', address: 'Meadowlands Zone 6, Soweto', verified: true, hours: 'Mon, Wed, Fri 10am–1pm', description: 'Network of 5 soup kitchens across Soweto zones. Serves thousands of residents weekly. Accepts donations of food and clothing.', phone: '011-984-5600' },
    // Cape Town
    { id: 8, name: 'Cape Town Community Chest', type: 'NGO', town: 'Cape Town', address: '15 Darling St, Cape Town', verified: true, hours: 'Weekdays 8am–4pm', description: 'Connects communities with food, shelter, and educational programmes. Partners with over 200 NPOs across the Western Cape.', phone: '021-461-6882' },
    { id: 9, name: 'Maitland Soup Kitchen', type: 'Soup Kitchen', town: 'Cape Town', address: '88 Voortrekker Rd, Maitland', verified: true, hours: 'Mon–Sat 12pm–2pm', description: 'One of Cape Town\'s oldest soup kitchens. Serves 300+ meals daily. Accepts food and cash donations. Also distributes donated clothing.', phone: '021-511-3456' },
    { id: 10, name: 'Khayelitsha Food Bank', type: 'Food Bank', town: 'Cape Town', address: 'Site B Community Hall, Khayelitsha', verified: true, hours: 'Tue & Fri 9am–1pm', description: 'Bi-weekly food parcel distribution in Khayelitsha. Priority given to child-headed households, the elderly and people with disabilities.', phone: '021-364-2200' },
    { id: 11, name: 'Bellville Feeding Scheme', type: 'Soup Kitchen', town: 'Cape Town', address: '22 Durban Rd, Bellville', verified: true, hours: 'Weekdays 11am–1pm', description: 'Feeding scheme providing hot meals and sandwiches to homeless individuals in the Bellville area. Run by local faith communities.', phone: '021-948-7100' },
    // Durban
    { id: 12, name: 'Durban Soup Kitchen', type: 'Soup Kitchen', town: 'Durban', address: '88 Point Rd, Durban', verified: true, hours: 'Daily 11am–1pm', description: 'Warm meals served every day. Also offers a clothing swap programme and hygiene kits for those in need. Serving Durban for over 20 years.', phone: '031-555-0701' },
    { id: 13, name: 'Umlazi Community Kitchen', type: 'Community Kitchen', town: 'Durban', address: 'Section V, Umlazi Township', verified: true, hours: 'Mon–Fri 10am–1pm', description: 'Community kitchen serving Umlazi residents with hot meals. Also runs a vegetable garden project and cooking skills training.', phone: '031-906-3400' },
    { id: 14, name: 'Pinetown Food Share', type: 'Food Bank', town: 'Durban', address: '12 Kings Rd, Pinetown', verified: true, hours: 'Thu 9am–12pm', description: 'Weekly food sharing programme redistributing surplus food from supermarkets and restaurants to families in need in Pinetown.', phone: '031-702-5500' },
    // Pretoria
    { id: 15, name: 'Pretoria Food Drive', type: 'Food Bank', town: 'Pretoria', address: '34 Church Square, Pretoria', verified: true, hours: 'Monthly — last Sat 9am–1pm', description: 'Monthly food drives collecting and distributing non-perishable goods. Drop-off points at major shopping centres and community halls.', phone: '012-555-0801' },
    { id: 16, name: 'Mamelodi Soup Kitchen', type: 'Soup Kitchen', town: 'Pretoria', address: 'Block J, Mamelodi East', verified: true, hours: 'Tue, Thu, Sat 11am–1pm', description: 'Soup kitchen serving Mamelodi East residents three times a week. Provides hot soup, bread and seasonal vegetables to 200+ people per session.', phone: '012-805-3300' },
    { id: 17, name: 'Atteridgeville Feeding Programme', type: 'Community Kitchen', town: 'Pretoria', address: 'Rabie Ridge Rd, Atteridgeville', verified: true, hours: 'Weekdays 12pm–2pm', description: 'Daily feeding programme targeting school children, the elderly and unemployed adults in Atteridgeville. Accepts food and monetary donations.', phone: '012-373-4400' },
    // Other towns
    { id: 18, name: 'St. Mary\'s Outreach', type: 'NGO', town: 'Sandton', address: '78 Church Rd, Sandton', verified: true, hours: 'Weekdays 8am–4pm', description: 'Clothing donations, food parcels, and counselling services. Walk-in support centre with qualified social workers on site.', phone: '011-555-0303' },
    { id: 19, name: 'Red Cross SA - JHB', type: 'NGO', town: 'Midrand', address: '90 Relief Blvd, Midrand', verified: true, hours: '24/7 emergency response', description: 'Emergency relief, first aid training, and community health services. Disaster response unit active during floods and extreme weather events.', phone: '011-555-0404' },
    { id: 20, name: 'Harvest of Hope Garden', type: 'Food Garden', town: 'Centurion', address: '22 Green St, Centurion', verified: true, hours: 'Sat 8am–12pm', description: 'Community garden providing fresh produce to families in need every Saturday. Vegetable boxes and herb bundles available free of charge.', phone: '012-555-0505' },
    { id: 21, name: 'Port Elizabeth Aid Centre', type: 'NGO', town: 'Port Elizabeth', address: '12 Settlers Way, Port Elizabeth', verified: true, hours: 'Mon–Fri 8am–4pm', description: 'Comprehensive aid centre offering food assistance, job placement support, and educational workshops. Family counselling on Wednesdays.', phone: '041-555-0901' },
    { id: 22, name: 'Bloemfontein Community Garden', type: 'Food Garden', town: 'Bloemfontein', address: '67 President Brand St, Bloemfontein', verified: true, hours: 'Sat 7am–11am', description: 'Urban food garden providing free produce to local families and shelters. Learn sustainable gardening while giving back to your community.', phone: '051-555-1001' },
    { id: 23, name: 'Polokwane Hunger Relief', type: 'Soup Kitchen', town: 'Polokwane', address: '5 Landdros Mare St, Polokwane', verified: true, hours: 'Mon–Fri 11am–1pm', description: 'Soup kitchen and food parcel distribution serving the greater Polokwane area. Meals cooked fresh daily by a dedicated volunteer team.', phone: '015-291-4400' },
    { id: 24, name: 'East London Meals on Wheels', type: 'Community Kitchen', town: 'East London', address: '45 Oxford St, East London', verified: true, hours: 'Weekdays 9am–3pm', description: 'Prepares and delivers hot meals to elderly and disabled residents throughout East London. Also has a walk-in canteen for the homeless.', phone: '043-722-1100' },
    { id: 25, name: 'Richards Bay Food Pantry', type: 'Food Bank', town: 'Richards Bay', address: '10 Meerensee Rd, Richards Bay', verified: true, hours: 'Wed & Sat 9am–12pm', description: 'Food pantry serving the greater Richards Bay area twice a week. Focuses on supporting mining-affected and fishing communities.', phone: '035-789-2200' },
];

// ─── SHELTERS ─────────────────────────────────────────────────────────────────
const shelterLocations = [
    { id: 1, name: 'Haven Night Shelter', type: 'Night Shelter', town: 'Cape Town', address: '52 Roeland St, Cape Town', capacity: 200, verified: true, description: 'Emergency overnight accommodation for homeless individuals and families. Provides beds, meals, and access to social workers. Open from 6pm daily.', phone: '021-461-7490', services: ['Beds', 'Meals', 'Social Work', 'Medical'] },
    { id: 2, name: 'Johannesburg Shelter Network', type: 'Emergency Shelter', town: 'Johannesburg', address: '15 Nugget St, Johannesburg', capacity: 150, verified: true, description: 'Emergency shelter for families in crisis. Case management, life skills training, and job placement assistance included.', phone: '011-334-4567', services: ['Beds', 'Meals', 'Life Skills', 'Job Assistance'] },
    { id: 3, name: 'Pretoria Salvation Army', type: 'Family Shelter', town: 'Pretoria', address: '45 Van der Walt St, Pretoria', capacity: 80, verified: true, description: 'Family shelter for women and children in crisis. Confidential intake, 24-hour support, and counselling services.', phone: '012-328-5555', services: ['Beds', 'Meals', 'Counselling', 'Legal Aid'] },
    { id: 4, name: 'Durban Night Shelter', type: 'Night Shelter', town: 'Durban', address: '22 Point Rd, Durban', capacity: 120, verified: true, description: 'Safe overnight accommodation for homeless adults in the Durban CBD. Meals, clothing, and referrals to social services provided.', phone: '031-368-3456', services: ['Beds', 'Meals', 'Clothing', 'Social Work'] },
    { id: 5, name: 'Soweto Community Shelter', type: 'Community Shelter', town: 'Soweto', address: '88 Vilakazi St, Soweto', capacity: 60, verified: true, description: 'Short-term accommodation for residents who have lost homes due to fires or disasters. Rebuilding support also available.', phone: '011-938-7890', services: ['Beds', 'Meals', 'Disaster Relief', 'Rebuilding Support'] },
    { id: 6, name: 'Sandton Women\'s Refuge', type: 'Women\'s Shelter', town: 'Sandton', address: 'Location confidential — call first', capacity: 40, verified: true, description: 'Confidential safe house for women and children fleeing domestic violence. Trauma counselling, legal support, and rehabilitation.', phone: '011-881-2345', services: ['Safe Housing', 'Counselling', 'Legal Aid', 'Childcare'] },
    { id: 7, name: 'Centurion Transitional Housing', type: 'Transitional Housing', town: 'Centurion', address: '10 Jean Ave, Centurion', capacity: 45, verified: true, description: 'Six-month transitional housing programme moving individuals from homelessness to stable living with life skills and job placement.', phone: '012-664-5678', services: ['Housing', 'Life Skills', 'Job Placement', 'Budgeting'] },
    { id: 8, name: 'East London Homeless Shelter', type: 'Night Shelter', town: 'East London', address: '34 Oxford St, East London', capacity: 90, verified: true, description: 'Overnight accommodation and daily meals for homeless adults in the Buffalo City area. Clothing donations accepted.', phone: '043-722-3456', services: ['Beds', 'Meals', 'Clothing', 'Community Support'] },
    { id: 9, name: 'Bloemfontein Ark Shelter', type: 'Night Shelter', town: 'Bloemfontein', address: '78 Zastron St, Bloemfontein', capacity: 110, verified: true, description: 'Large night shelter in the Bloemfontein CBD. Provides beds, 3 meals a day, and access to substance rehabilitation referrals.', phone: '051-444-7700', services: ['Beds', 'Meals', 'Rehab Referrals', 'Social Work'] },
    { id: 10, name: 'Cape Flats Shelter Alliance', type: 'Emergency Shelter', town: 'Cape Town', address: 'Mitchells Plain Town Centre', capacity: 70, verified: true, description: 'Emergency shelter on the Cape Flats offering immediate accommodation to gang violence-displaced families and individuals in crisis.', phone: '021-393-1100', services: ['Beds', 'Meals', 'Safety', 'Trauma Support'] },
];

// ─── MEDICAL SERVICES ─────────────────────────────────────────────────────────
const medicalServices = [
    // Johannesburg Public
    { id: 1, name: 'Charlotte Maxeke Johannesburg Hospital', type: 'Public Hospital', town: 'Johannesburg', address: '7 York Rd, Parktown, Johannesburg', emergency: true, verified: true, description: 'Major academic hospital and trauma centre. 24-hour emergency department. Specialises in trauma, oncology, and cardiac care. Affiliated with Wits University.', phone: '011-488-3911', beds: 1088 },
    { id: 2, name: 'Helen Joseph Hospital', type: 'Public Hospital', town: 'Johannesburg', address: 'Perth Rd, Auckland Park, Johannesburg', emergency: true, verified: true, description: 'Tertiary public hospital with 24-hour emergency services. Specialises in maternity, paediatrics, and internal medicine. Serves the west of Johannesburg.', phone: '011-489-1011', beds: 672 },
    { id: 3, name: 'Chris Hani Baragwanath Hospital', type: 'Public Hospital', town: 'Soweto', address: 'Chris Hani Rd, Diepkloof, Soweto', emergency: true, verified: true, description: 'One of the largest hospitals in the world. Comprehensive emergency and specialist services. 24-hour trauma unit. Serves over 1 million Soweto residents.', phone: '011-933-8000', beds: 3200 },
    { id: 4, name: 'Steve Biko Academic Hospital', type: 'Public Hospital', town: 'Pretoria', address: 'Steve Biko Rd, Arcadia, Pretoria', emergency: true, verified: true, description: 'Leading academic hospital in Gauteng. Full 24-hour emergency trauma centre. Tertiary referral centre for Limpopo, North West and Mpumalanga.', phone: '012-354-1000', beds: 780 },
    { id: 5, name: 'Kalafong Provincial Hospital', type: 'Public Hospital', town: 'Pretoria', address: 'Kalafong Dr, Atteridgeville, Pretoria', emergency: true, verified: true, description: '24-hour emergency department serving Atteridgeville, Soshanguve, and surrounding areas. Also offers maternity, paediatric and surgical services.', phone: '012-318-6000', beds: 590 },
    // Cape Town Public
    { id: 6, name: 'Groote Schuur Hospital', type: 'Public Hospital', town: 'Cape Town', address: 'Anzio Rd, Observatory, Cape Town', emergency: true, verified: true, description: 'World-renowned hospital where the first heart transplant was performed. Full 24-hour emergency trauma unit. Specialist referral centre for the Western Cape.', phone: '021-404-9111', beds: 912 },
    { id: 7, name: 'Tygerberg Hospital', type: 'Public Hospital', town: 'Cape Town', address: 'Francie van Zijl Dr, Bellville, Cape Town', emergency: true, verified: true, description: 'Largest hospital in the Western Cape. 24-hour emergency care, trauma unit, and comprehensive specialist services. Handles over 500 emergencies daily.', phone: '021-938-4911', beds: 1380 },
    { id: 8, name: 'Karl Bremer Hospital', type: 'Public Hospital', town: 'Cape Town', address: 'Mike Pienaar Blvd, Bellville', emergency: true, verified: true, description: 'Regional public hospital serving the Northern Suburbs of Cape Town. 24-hour emergency services, maternity, and general surgery.', phone: '021-918-1911', beds: 520 },
    // Durban Public
    { id: 9, name: 'King Edward VIII Hospital', type: 'Public Hospital', town: 'Durban', address: 'Umbilo Rd, Umbilo, Durban', emergency: true, verified: true, description: 'One of KZN\'s biggest hospitals. Full emergency services, trauma unit, and specialist departments. Academic affiliate of UKZN Medical School.', phone: '031-360-3111', beds: 1336 },
    { id: 10, name: 'Addington Hospital', type: 'Public Hospital', town: 'Durban', address: '16 Erskine Terrace, South Beach, Durban', emergency: true, verified: true, description: 'Durban CBD public hospital with 24-hour emergency room. Trauma centre and general medical services. Convenient for Durban beachfront emergencies.', phone: '031-327-2000', beds: 650 },
    // Other towns
    { id: 11, name: 'Frere Hospital', type: 'Public Hospital', town: 'East London', address: 'Amalinda Main Rd, East London', emergency: true, verified: true, description: 'Main public hospital serving East London and the Eastern Cape. 24-hour emergency department, trauma centre, maternity and paediatric wards.', phone: '043-709-2111', beds: 884 },
    { id: 12, name: 'Grey\'s Hospital', type: 'Public Hospital', town: 'Pietermaritzburg', address: 'Townbush Rd, Pietermaritzburg', emergency: true, verified: true, description: 'Major provincial hospital for the KZN Midlands. Full emergency services including trauma and burns unit. Cardiothoracic referral centre.', phone: '033-897-3000', beds: 570 },
    { id: 13, name: 'Mankweng Hospital', type: 'Public Hospital', town: 'Polokwane', address: 'Mankweng Township, Polokwane', emergency: true, verified: true, description: 'Main referral hospital for the Capricorn District. 24-hour emergency care, casualty department, and full specialist services.', phone: '015-267-9000', beds: 490 },
    { id: 14, name: 'Rob Ferreira Hospital', type: 'Public Hospital', town: 'Nelspruit', address: 'Ferreira St, Nelspruit (Mbombela)', emergency: true, verified: true, description: 'Main public hospital for Mpumalanga. 24-hour trauma unit and emergency care. Serves the greater Lowveld area.', phone: '013-741-5000', beds: 410 },
    // Private Hospitals
    { id: 15, name: 'Netcare Rosebank Hospital', type: 'Private Hospital', town: 'Johannesburg', address: '14 Sturdee Ave, Rosebank, Johannesburg', emergency: true, verified: true, description: 'Full-service private hospital with 24-hour casualty. Cardiology, oncology, orthopaedics. Accepts most medical aids and emergency self-pay.', phone: '011-328-0500', beds: 243 },
    { id: 16, name: 'Life Park Hospital', type: 'Private Hospital', town: 'Johannesburg', address: '1 Park Ln, Parktown, Johannesburg', emergency: true, verified: true, description: 'Private hospital offering 24-hour emergency services, ICU, cardiology, neurosurgery, and maternity. Accepts major medical aids.', phone: '011-483-1555', beds: 186 },
    { id: 17, name: 'Mediclinic Panorama', type: 'Private Hospital', town: 'Cape Town', address: 'Rothschild Blvd, Panorama, Cape Town', emergency: true, verified: true, description: 'Full-service private hospital in the Northern Suburbs. 24-hour emergency unit, oncology, cardiac, and maternity departments.', phone: '021-938-2111', beds: 298 },
    { id: 18, name: 'Life Westville Hospital', type: 'Private Hospital', town: 'Durban', address: '1 Ethel Ave, Westville, Durban', emergency: true, verified: true, description: 'Leading private hospital in Durban. 24-hour casualty, cardiac surgery, neurosurgery, oncology, and ICU. Most medical aids accepted.', phone: '031-268-5000', beds: 250 },
    // Clinics / First Aid
    { id: 19, name: 'ER24 Emergency Services', type: 'First Aid & EMS', town: 'Johannesburg', address: 'Nationwide — call for nearest unit', emergency: true, verified: true, description: 'Private emergency medical services operating 24/7 nationwide. Advanced life support paramedics dispatched on call. Also offers first aid training.', phone: '084 124', beds: 0 },
    { id: 20, name: 'Netcare 911 Emergency', type: 'First Aid & EMS', town: 'Johannesburg', address: 'Nationwide — call for nearest unit', emergency: true, verified: true, description: 'Netcare\'s emergency medical service available 24/7 across South Africa. Dispatches paramedics and air ambulances to emergencies nationwide.', phone: '082 911', beds: 0 },
    { id: 21, name: 'Western Cape EMS', type: 'First Aid & EMS', town: 'Cape Town', address: 'Stikland, Bellville, Cape Town', emergency: true, verified: true, description: 'Government emergency medical services for the Western Cape. Operates ambulances and advanced life support teams throughout the province.', phone: '021-937-0300', beds: 0 },
    { id: 22, name: 'KZN EMS Provincial Services', type: 'First Aid & EMS', town: 'Durban', address: 'Stanger St, Durban (Control Room)', emergency: true, verified: true, description: 'Provincial emergency medical services for KwaZulu-Natal. Free ambulance service for all residents in life-threatening emergencies.', phone: '031-361-6555', beds: 0 },
    { id: 23, name: 'Red Cross First Aid Training', type: 'First Aid Training', town: 'Johannesburg', address: '30 Leyds St, Braamfontein, Johannesburg', emergency: false, verified: true, description: 'South African Red Cross Society offers certified first aid training courses at multiple levels. Workplace and community first aid certification.', phone: '011-482-2711', beds: 0 },
    { id: 24, name: 'St John Ambulance SA', type: 'First Aid & EMS', town: 'Cape Town', address: '19 Devonshire Hill Rd, Cape Town', emergency: true, verified: true, description: 'Non-profit providing first aid training and ambulance services. Trained volunteers assist at public events, accidents, and community emergencies.', phone: '021-461-8420', beds: 0 },
];

// ─── ROADSIDE / TOW TRUCK ─────────────────────────────────────────────────────
const roadsideServices = [
    { id: 1, name: 'AA Roadside Assistance', type: 'AA Service', town: 'All', address: 'Nationwide', verified: true, available: '24/7', description: 'South Africa\'s most trusted breakdown and roadside assistance service. Battery jump-start, tyre change, fuel delivery, towing, and lockout assistance. Membership or pay-per-use.', phone: '0800 010 101' },
    { id: 2, name: 'ER24 Roadside Assist', type: 'Tow Truck', town: 'All', address: 'Nationwide', verified: true, available: '24/7', description: 'ER24 provides emergency roadside assistance and towing services alongside their paramedic operations. Rapid response to accident scenes and breakdowns.', phone: '084 124' },
    { id: 3, name: 'Budget Towing JHB', type: 'Tow Truck', town: 'Johannesburg', address: 'Heriotdale, Johannesburg', verified: true, available: '24/7', description: 'Affordable towing and roadside assistance across Gauteng. Flat-bed and wheel-lift towing for all vehicle types. Accident recovery specialists.', phone: '011-615-3300' },
    { id: 4, name: 'SA National Roads Assist', type: 'Freeway Management', town: 'Johannesburg', address: 'N1/N3 Freeway Corridors, Gauteng', verified: true, available: '24/7', description: 'SANRAL\'s freeway management system provides free emergency towing for stranded motorists on national routes. Patrols major highways 24 hours.', phone: '0800 63 43 57' },
    { id: 5, name: 'ProTow Cape Town', type: 'Tow Truck', town: 'Cape Town', address: 'Parow, Cape Town', verified: true, available: '24/7', description: 'Cape Town\'s premier towing company. Covers all Cape Peninsula routes. Accident scene recovery, long-distance towing, and vehicle storage available.', phone: '021-932-4444' },
    { id: 6, name: 'Durban Emergency Towing', type: 'Tow Truck', town: 'Durban', address: 'Umbilo, Durban', verified: true, available: '24/7', description: 'Reliable 24/7 towing across the greater Durban area. Motorcycle, car, and heavy vehicle towing. Average response time 20 minutes.', phone: '031-206-5500' },
    { id: 7, name: 'Pretoria Fast Tow', type: 'Tow Truck', town: 'Pretoria', address: 'Silverton, Pretoria', verified: true, available: '24/7', description: 'Fast towing and breakdown response for Pretoria and Centurion. Insurance-approved. Flat-bed towing for luxury and sport vehicles.', phone: '012-804-2200' },
    { id: 8, name: 'MFC Road Rescue', type: 'Tow Truck', town: 'Johannesburg', address: 'Midrand, Gauteng', verified: true, available: '24/7', description: 'Midrand and Centurion\'s dedicated towing service. Handles accident recovery, vehicle relocation, and emergency lockouts. All vehicle types covered.', phone: '011-318-7700' },
    { id: 9, name: 'N2 Towing Services', type: 'Tow Truck', town: 'East London', address: 'King William\'s Town Rd, East London', verified: true, available: '24/7', description: 'Towing and roadside assistance along the N2 between East London and Port Elizabeth. Local and long-distance towing. Recovery and storage on site.', phone: '043-745-1100' },
    { id: 10, name: 'Polokwane Tow & Go', type: 'Tow Truck', town: 'Polokwane', address: 'Grobler St, Polokwane', verified: true, available: '24/7', description: 'Limpopo\'s leading breakdown and towing service. Covers the N1 North corridor to Beit Bridge. Fast response, all vehicle sizes accepted.', phone: '015-293-4400' },
    { id: 11, name: 'Bloemfontein Breakdown', type: 'Tow Truck', town: 'Bloemfontein', address: 'Langenhoven Park, Bloemfontein', verified: true, available: '24/7', description: 'Trusted breakdown and towing in the Free State. Covers Bloemfontein, Botshabelo and all N1 routes. Insurance-approved and member of SATA.', phone: '051-445-8800' },
    { id: 12, name: 'Nelspruit 24H Towing', type: 'Tow Truck', town: 'Nelspruit', address: 'Kaapsche Hoop Rd, Mbombela', verified: true, available: '24/7', description: 'Serving Mpumalanga on all major routes including N4 and R40. Mountain recovery specialists. Handles tourist and cross-border vehicle incidents.', phone: '013-752-4400' },
    { id: 13, name: 'Cape Breakdown Services', type: 'Roadside Assist', town: 'Cape Town', address: 'Bellville, Cape Town', verified: true, available: '24/7', description: 'Comprehensive roadside assistance — tyre changes, jump-starts, fuel delivery, lockouts, and towing throughout the Western Cape. No membership needed.', phone: '021-945-7700' },
    { id: 14, name: 'Richards Bay Auto Rescue', type: 'Tow Truck', town: 'Richards Bay', address: 'Alkantstrand Rd, Richards Bay', verified: true, available: '24/7', description: 'Roadside assistance and towing in Zululand and the KZN North Coast. Covers Richards Bay, Empangeni, and Eshowe.', phone: '035-789-5500' },
];

// ─── LOCAL DEALS ──────────────────────────────────────────────────────────────
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
const aidTypes = ['All', 'Food Bank', 'Soup Kitchen', 'Community Kitchen', 'NGO', 'Food Garden'];
const shelterTypes = ['All', 'Night Shelter', 'Emergency Shelter', 'Family Shelter', "Women's Shelter", 'Transitional Housing', 'Community Shelter'];
const medicalTypes = ['All', 'Public Hospital', 'Private Hospital', 'First Aid & EMS', 'First Aid Training'];
const roadsideTypes = ['All', 'AA Service', 'Tow Truck', 'Roadside Assist', 'Freeway Management'];

const emergencyContacts = [
    { name: 'All Emergencies', phone: '112', desc: 'Works on any network, even no airtime' },
    { name: 'Police (SAPS)', phone: '10111', desc: 'South African Police Service' },
    { name: 'Ambulance / Fire', phone: '10177', desc: 'Medical & fire emergency' },
    { name: 'ER24 Paramedics', phone: '084 124', desc: 'Private emergency medical' },
    { name: 'Netcare 911', phone: '082 911', desc: 'Private emergency medical' },
    { name: 'AA Breakdown', phone: '0800 010 101', desc: 'Roadside & towing' },
    { name: 'GBV Helpline', phone: '0800 428 428', desc: 'Gender-based violence — free' },
    { name: 'Childline SA', phone: '116', desc: 'Child abuse & crisis — free' },
];

export default function CommunitySupport() {
    const { user } = useAuth();
    const [section, setSection] = useState<Section>('aid');
    const [search, setSearch] = useState('');
    const [aidTypeFilter, setAidTypeFilter] = useState('All');
    const [shelterTypeFilter, setShelterTypeFilter] = useState('All');
    const [medicalTypeFilter, setMedicalTypeFilter] = useState('All');
    const [roadsideTypeFilter, setRoadsideTypeFilter] = useState('All');
    const [dealCategoryFilter, setDealCategoryFilter] = useState('All');
    const [showAllTowns, setShowAllTowns] = useState(false);

    const q = search.toLowerCase();

    const filteredAid = aidLocations.filter(a =>
        (aidTypeFilter === 'All' || a.type === aidTypeFilter) &&
        (showAllTowns || a.town === user?.town) &&
        (!q || a.name.toLowerCase().includes(q) || a.address.toLowerCase().includes(q) || a.type.toLowerCase().includes(q))
    );

    const filteredShelters = shelterLocations.filter(s =>
        (shelterTypeFilter === 'All' || s.type === shelterTypeFilter) &&
        (showAllTowns || s.town === user?.town) &&
        (!q || s.name.toLowerCase().includes(q) || s.town.toLowerCase().includes(q) || s.type.toLowerCase().includes(q))
    );

    const filteredMedical = medicalServices.filter(m =>
        (medicalTypeFilter === 'All' || m.type === medicalTypeFilter) &&
        (showAllTowns || m.town === user?.town || m.town === 'All') &&
        (!q || m.name.toLowerCase().includes(q) || m.type.toLowerCase().includes(q) || m.address.toLowerCase().includes(q))
    );

    const filteredRoadside = roadsideServices.filter(r =>
        (roadsideTypeFilter === 'All' || r.type === roadsideTypeFilter) &&
        (showAllTowns || r.town === user?.town || r.town === 'All') &&
        (!q || r.name.toLowerCase().includes(q) || r.type.toLowerCase().includes(q))
    );

    const filteredDeals = localDeals.filter(d =>
        (dealCategoryFilter === 'All' || d.category === dealCategoryFilter) &&
        (showAllTowns || d.town === user?.town) &&
        (!q || d.store.toLowerCase().includes(q) || d.deal.toLowerCase().includes(q))
    );

    const sections: { key: Section; label: string }[] = [
        { key: 'aid', label: 'Free Food & Aid' },
        { key: 'shelters', label: 'Shelters' },
        { key: 'medical', label: 'Hospitals & EMS' },
        { key: 'roadside', label: 'Tow & Roadside' },
        { key: 'deals', label: 'Local Deals' },
    ];

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">Community Support</h1>
            <p className="text-sm text-text-light mb-4">Find free food, shelters, hospitals, tow trucks, and local deals in {user?.town}</p>

            {/* Emergency Contacts */}
            <div className="card !p-4 mb-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
                <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide mb-3">Emergency Numbers</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {emergencyContacts.map(c => (
                        <a key={c.name} href={`tel:${c.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors no-underline">
                            <PhoneIcon size={14} className="text-red-500 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-text truncate">{c.name}</p>
                                <p className="text-[11px] font-bold text-red-500">{c.phone}</p>
                                <p className="text-[9px] text-text-muted truncate">{c.desc}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Section Tabs */}
            <div className="flex gap-1 mb-4 bg-surface-dark rounded-lg p-1 overflow-x-auto">
                {sections.map(s => (
                    <button
                        key={s.key}
                        onClick={() => setSection(s.key)}
                        className={`flex-1 py-2 px-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${section === s.key ? 'bg-surface-card shadow text-text' : 'text-text-light'}`}
                    >{s.label}</button>
                ))}
            </div>

            {/* Search + Town Toggle */}
            <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                    <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="input pl-10" />
                </div>
                <button onClick={() => setShowAllTowns(!showAllTowns)} className={`btn btn-sm whitespace-nowrap ${showAllTowns ? 'btn-primary' : 'btn-outline'}`}>
                    {showAllTowns ? 'All Towns' : 'My Town'}
                </button>
            </div>

            {/* ── Free Food & Aid ── */}
            {section === 'aid' && (
                <>
                    <FilterChips options={aidTypes} selected={aidTypeFilter} onChange={setAidTypeFilter} />
                    {filteredAid.length === 0
                        ? <EmptyState icon={HeartIcon} message="No aid locations found for your area. Try showing all towns." />
                        : <div className="space-y-3">
                            {filteredAid.map(loc => (
                                <div key={loc.id} className="card">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div>
                                            <h3 className="font-semibold text-sm">{loc.name}</h3>
                                            <p className="text-xs text-text-light flex items-center gap-1 mt-0.5"><MapPinIcon size={11} />{loc.address}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            {loc.verified && <span className="badge badge-primary text-[10px]">Verified</span>}
                                            <span className="badge badge-secondary text-[10px]">{loc.type}</span>
                                        </div>
                                    </div>
                                    {'hours' in loc && <p className="text-xs font-semibold text-primary mb-1">🕐 {loc.hours}</p>}
                                    <p className="text-xs text-text-light mb-2">{loc.description}</p>
                                    <a href={`tel:${loc.phone}`} className="inline-flex items-center gap-1 text-xs text-primary font-medium"><PhoneIcon size={12} />{loc.phone}</a>
                                </div>
                            ))}
                          </div>
                    }
                </>
            )}

            {/* ── Shelters ── */}
            {section === 'shelters' && (
                <>
                    <FilterChips options={shelterTypes} selected={shelterTypeFilter} onChange={setShelterTypeFilter} />
                    {filteredShelters.length === 0
                        ? <EmptyState icon={HomeIcon} message="No shelters found for your area. Try showing all towns." />
                        : <div className="space-y-3">
                            {filteredShelters.map(s => (
                                <div key={s.id} className="card">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div>
                                            <h3 className="font-semibold text-sm">{s.name}</h3>
                                            <p className="text-xs text-text-light flex items-center gap-1 mt-0.5"><MapPinIcon size={11} />{s.address}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            {s.verified && <span className="badge badge-primary text-[10px]">Verified</span>}
                                            <span className="badge badge-secondary text-[10px]">{s.type}</span>
                                            <span className="text-[10px] text-text-muted">Capacity: {s.capacity}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-text-light mb-2">{s.description}</p>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {s.services.map(svc => <span key={svc} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-medium">{svc}</span>)}
                                    </div>
                                    <a href={`tel:${s.phone}`} className="inline-flex items-center gap-1 text-xs text-primary font-medium"><PhoneIcon size={12} />{s.phone}</a>
                                </div>
                            ))}
                          </div>
                    }
                </>
            )}

            {/* ── Medical / Hospitals ── */}
            {section === 'medical' && (
                <>
                    <FilterChips options={medicalTypes} selected={medicalTypeFilter} onChange={setMedicalTypeFilter} />
                    {filteredMedical.length === 0
                        ? <EmptyState icon={AlertIcon} message="No medical services found. Try showing all towns." />
                        : <div className="space-y-3">
                            {filteredMedical.map(m => (
                                <div key={m.id} className={`card ${m.emergency ? 'border-red-200 dark:border-red-800' : ''}`}>
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                                {m.emergency && <span className="badge bg-red-500 text-white text-[10px]">24H Emergency</span>}
                                                <h3 className="font-semibold text-sm">{m.name}</h3>
                                            </div>
                                            {m.address !== 'Nationwide — call for nearest unit' && (
                                                <p className="text-xs text-text-light flex items-center gap-1"><MapPinIcon size={11} />{m.address}</p>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            <span className={`badge text-[10px] ${m.type === 'Public Hospital' ? 'badge-primary' : m.type === 'Private Hospital' ? 'badge-accent' : 'badge-secondary'}`}>{m.type}</span>
                                            {m.beds > 0 && <span className="text-[10px] text-text-muted">{m.beds} beds</span>}
                                        </div>
                                    </div>
                                    <p className="text-xs text-text-light mb-2">{m.description}</p>
                                    <a href={`tel:${m.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1 text-xs text-primary font-bold"><PhoneIcon size={12} />{m.phone}</a>
                                </div>
                            ))}
                          </div>
                    }
                </>
            )}

            {/* ── Roadside / Tow ── */}
            {section === 'roadside' && (
                <>
                    <FilterChips options={roadsideTypes} selected={roadsideTypeFilter} onChange={setRoadsideTypeFilter} />
                    {filteredRoadside.length === 0
                        ? <EmptyState icon={ShieldIcon} message="No roadside services found. Try showing all towns." />
                        : <div className="space-y-3">
                            {filteredRoadside.map(r => (
                                <div key={r.id} className="card">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div>
                                            <h3 className="font-semibold text-sm">{r.name}</h3>
                                            <p className="text-xs text-text-light flex items-center gap-1 mt-0.5"><MapPinIcon size={11} />{r.address}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            {r.verified && <span className="badge badge-primary text-[10px]">Verified</span>}
                                            <span className="badge badge-secondary text-[10px]">{r.type}</span>
                                            <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold">{r.available}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-text-light mb-2">{r.description}</p>
                                    <a href={`tel:${r.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1 text-xs text-primary font-bold"><PhoneIcon size={12} />{r.phone}</a>
                                </div>
                            ))}
                          </div>
                    }
                </>
            )}

            {/* ── Deals ── */}
            {section === 'deals' && (
                <>
                    <FilterChips options={dealCategories} selected={dealCategoryFilter} onChange={setDealCategoryFilter} />
                    {filteredDeals.length === 0
                        ? <EmptyState icon={StarIcon} message="No deals found for your area. Try showing all towns." />
                        : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredDeals.map(d => (
                                <div key={d.id} className="card !p-0 overflow-hidden">
                                    <img src={d.image} alt={d.store} className="w-full h-36 object-cover" loading="lazy" />
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="badge badge-accent text-[10px]">{d.category}</span>
                                            <span className="text-[10px] text-text-muted flex items-center gap-0.5"><MapPinIcon size={10} />{d.town}</span>
                                        </div>
                                        <h3 className="font-semibold text-sm">{d.store}</h3>
                                        <p className="text-sm text-primary font-medium mt-1">{d.deal}</p>
                                        <p className="text-xs text-text-muted mt-2">Valid: {d.validUntil}</p>
                                    </div>
                                </div>
                            ))}
                          </div>
                    }
                </>
            )}

            <p className="text-center text-xs text-text-muted mt-8 opacity-50">
                Community Support by Kurt van Kradenburg, Anjanette Venter, Ninke Hough & Ryan Cronje
            </p>
        </div>
    );
}

function FilterChips({ options, selected, onChange }: { options: string[]; selected: string; onChange: (v: string) => void }) {
    return (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {options.map(o => (
                <button key={o} onClick={() => onChange(o)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${selected === o ? 'bg-primary text-white' : 'bg-surface-dark text-text-light hover:bg-border'}`}>
                    {o}
                </button>
            ))}
        </div>
    );
}

function EmptyState({ icon: Icon, message }: { icon: React.FC<any>; message: string }) {
    return (
        <div className="card text-center py-10">
            <Icon size={32} className="mx-auto text-text-muted mb-3" />
            <p className="text-sm text-text-light">{message}</p>
        </div>
    );
}
