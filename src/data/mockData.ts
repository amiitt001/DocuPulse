import { DocItem, QRItem, PageCardItem } from '../types';

export const DOCUPULSE_LOGO_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1XY0xXKLiKR74U_ik_nj3X9kwiyxVbC1Ssm-EvZkBZOrsevOMcE6XYgmOZnTgQXl7MRLqEk2NTMIMwq79p1ouHLZ1GNXBMLxy1QuxUpcvtsTgqnoVv56SHUX1gFwTQTnsp4B58nuFZY7XtL_H6-lEJiSYr3AJTkpaMrIeOgFhaupPKi9mbovSvlvDJs76gWR6B1iI9Hs-lafM3RjVklwLfGNwQam_AMcpuS3MAl3qDYvW2JtCY4T9E6Ev8';

export const CROP_DOCUMENT_SAMPLE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG2iYsMM-wuTqAIM5WY9gGijoUEqA-S9lxWBlnOfCVQj60MaEPPEG_yzkgRVC3SFVlshHCkb21BCiGWKf-2e3ieppm4ITYe6b6gi3b4sJSqp1YUsbTyKR4_gHBDpST0fdgiN-o02Nskd0vdxdGQ0tEDxJ9RbI6LjZCP6puxK8t0Am8aF98kfBboQaxPIlQqC10if46rAJnJ7Z5BNzstbNxUFu8mNV8gWJtr0MzuiEHfgq2EShLGiu4';

export const SCANNER_CAMERA_SAMPLE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ0nM1lkGm5i6PpJ4sFSHrZCHB4zyfOTI-v9lPDY7l56t6gkQeJm4jWApCs8-E1HQK4RzErtrAJ5j1O_4iHt82DiV6lwrOSup0rPCObThYlVeGa5d9xVNNq_gzSnZ2x-dKJ0o00bZcfvI2-8-KW7VL4ZlLvebJeS7oCrW9wMfxhBI_XpyuEmYdq9rxIt7v0q5-xq5FaaTR2lbDp7h5hzaMDzqnHJqJOXe_zL8ksyG14RtEMK9FJ8bf';

export const GALLERY_THUMB_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEbmBJGpN5iOMXFX0SMCj3ZQZapuoxlGqZLsPnHAKobQth2scFh6tI8_m1yHSyeeqv6MAJ6uRaivF2ho9nDP384eDRCNARRJgLM0TnQlfR9oTN3Sxqi-zjczAZdfRSd58hQ-G0RVI2sVnZd7BsXSkG5cZmcaitR7ootT9aPtjUYUJ105DKqALcWosdr49ra6q4OAvhyd704agubHetPA5D6L9QOYPb7xcVndAjnhv-XgVR-hW-gDi0';

export const BATCH_REVIEW_THUMB_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPxaTxmgCvTuSoykHlMrZ24z5c1ijS64CO8-p86rp9KCzbd0Ziuga8E2Ww9jXM0h9D55120qeRnObmlHeOTBLzadW1vud5zluyGl1u1H-SjcWBMKFYUn3jqG-Wnyv2BLPiGFCYI4hy-sq4svvnneIRDBxZ-ygyVbl8kaRFJTPvPlUp55iCps0O92F8Mqvxbf8xwdg0P4tL8cPgRE6vrwM15ooxnmVDnPAWte-VIw24HOuIYKcMgO24';

export const INITIAL_FILES: DocItem[] = [
  {
    id: 'f1',
    filename: 'College_Assignment_Final.pdf',
    pages: 12,
    size: '4.2 MB',
    date: 'Today, 8:42 PM',
    type: 'pdf',
    cache: {
      status: 'cached',
      lastSynced: '2 mins ago',
      cacheSize: '4.2 MB',
      isPinned: true,
      integrityHash: 'sha256-a9f81d..e2',
      highResCached: true,
    },
  },
  {
    id: 'f2',
    filename: 'Lease_Agreement_Signed.pdf',
    pages: 4,
    size: '1.8 MB',
    date: 'Yesterday, 3:15 PM',
    type: 'pdf',
    isLocked: true,
    cache: {
      status: 'cached',
      lastSynced: '18 mins ago',
      cacheSize: '1.8 MB',
      isPinned: true,
      integrityHash: 'sha256-c4391e..8b',
      highResCached: true,
    },
  },
  {
    id: 'f3',
    filename: 'Medical_Prescription_Scan.pdf',
    pages: 1,
    size: '620 KB',
    date: 'Oct 14, 11:20 AM',
    type: 'pdf',
    isOcr: true,
    cache: {
      status: 'cached',
      lastSynced: '1 hour ago',
      cacheSize: '620 KB',
      isPinned: false,
      integrityHash: 'sha256-d7102b..19',
      highResCached: true,
    },
  },
  {
    id: 'f4',
    filename: 'Office_WiFi_QR.png',
    pages: 1,
    size: '128 KB',
    date: 'Oct 12, 4:00 PM',
    type: 'qr',
    tag: 'WiFi',
    cache: {
      status: 'cached',
      lastSynced: 'Yesterday',
      cacheSize: '128 KB',
      isPinned: false,
      integrityHash: 'sha256-f2038a..55',
      highResCached: true,
    },
  },
  {
    id: 'f5',
    filename: 'ID_Card_Front_Back.pdf',
    pages: 2,
    size: '950 KB',
    date: 'Oct 10, 9:15 AM',
    type: 'pdf',
    cache: {
      status: 'cached',
      lastSynced: 'Yesterday',
      cacheSize: '950 KB',
      isPinned: true,
      integrityHash: 'sha256-bb8204..3a',
      highResCached: true,
    },
  },
  {
    id: 'f6',
    filename: 'Tax_Invoice_2024.pdf',
    pages: 2,
    size: '840 KB',
    date: 'Oct 14, 11:20 AM',
    type: 'pdf',
    cache: {
      status: 'cached',
      lastSynced: '2 days ago',
      cacheSize: '840 KB',
      isPinned: false,
      integrityHash: 'sha256-ee1994..9c',
      highResCached: true,
    },
  },
  {
    id: 'f7',
    filename: 'Annual_Report_2024.pdf',
    pages: 6,
    size: '3.4 MB',
    date: 'Oct 08, 2:10 PM',
    type: 'pdf',
    cache: {
      status: 'cached',
      lastSynced: '3 days ago',
      cacheSize: '3.4 MB',
      isPinned: true,
      integrityHash: 'sha256-47b2c0..ff',
      highResCached: true,
    },
  },
  {
    id: 'f8',
    filename: 'Quarterly_Financial_Summary.pdf',
    pages: 18,
    size: '1.4 MB',
    date: 'Oct 04, 10:15 AM',
    type: 'pdf',
    cache: {
      status: 'cached',
      lastSynced: 'Just now',
      cacheSize: '1.4 MB',
      isPinned: true,
      integrityHash: 'sha256-990aef..13',
      highResCached: true,
    },
  }
];

export const INITIAL_QR_CODES: QRItem[] = [
  {
    id: 'qr1',
    title: 'Office Guest Wi-Fi',
    subtitle: 'Wi-Fi (WPA2) • 2h ago',
    type: 'wifi',
    payload: 'WIFI:S:DocuPulse-Guest;T:WPA;P:PulseGuest2026;;',
    date: '2h ago'
  },
  {
    id: 'qr2',
    title: 'https://docupulse.local/specs',
    subtitle: 'Website URL • Yesterday',
    type: 'url',
    payload: 'https://docupulse.local/specs',
    date: 'Yesterday'
  },
  {
    id: 'qr3',
    title: 'Dr. Aris Vance (vCard)',
    subtitle: 'Contact card • Oct 12',
    type: 'contact',
    payload: 'BEGIN:VCARD\nVERSION:3.0\nN:Vance;Aris\nFN:Dr. Aris Vance\nORG:DocuPulse Labs\nTEL:+1-555-019-2834\nEMAIL:aris@docupulse.local\nEND:VCARD',
    date: 'Oct 12'
  }
];

export const INITIAL_PAGES: PageCardItem[] = [
  {
    id: 1,
    pageNum: 1,
    title: 'Cover Sheet',
    type: 'cover',
    rotation: 0,
    isSelected: false,
    footerLabel: "ANNUAL '24"
  },
  {
    id: 2,
    pageNum: 2,
    title: 'Financial Highlights',
    type: 'chart',
    rotation: 0,
    isSelected: true,
    statBadge: '+18.4%',
    footerLabel: 'Q1-Q4 EBITDA'
  },
  {
    id: 3,
    pageNum: 3,
    title: 'Governance & Risk',
    type: 'text',
    rotation: 0,
    isSelected: false,
    footerLabel: 'Pg 3'
  },
  {
    id: 4,
    pageNum: 4,
    title: 'Audit Summary',
    type: 'table',
    rotation: 0,
    isSelected: true,
    statBadge: 'Verified',
    footerLabel: 'SECTION IV'
  },
  {
    id: 5,
    pageNum: 5,
    title: 'Global Regional Share',
    type: 'pie',
    rotation: 0,
    isSelected: false,
    footerLabel: 'DISTRIBUTION'
  },
  {
    id: 6,
    pageNum: 6,
    title: 'Signatures & Seals',
    type: 'signatures',
    rotation: 0,
    isSelected: false,
    footerLabel: 'EXECUTED'
  }
];
