export interface IndustryPartner {
    id: number
    company_name: string,
    description: string,

    company_head: string,
    head_position: string,
    immediate_supervisor: string,
    supervisor_position: string,
    
    region: string, 
    province: string,
    municipality: string,
    barangay: string,
    street: string,
    zip_code: string,

    telephone_number: string,
    mobile_number: string,
    fax_number: string,
    email: string,
    website: string,

    image: string,
}