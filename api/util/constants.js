export const checklistItems = [
    { checklistName: "Valid NCT", checklistStatus: false },
    { checklistName: "Valid Motor Tax Disc", checklistStatus: false },
    { checklistName: "Valid Insurance", checklistStatus: false },
    { checklistName: "Valid Learner Permit", checklistStatus: false },
    { checklistName: "L-plates displayed on front and rear", checklistStatus: false },
    { checklistName: "All lights working", checklistStatus: false },
    { checklistName: "Bonnet Check", checklistStatus: false },
    { checklistName: "Seatbelts functioning correctly", checklistStatus: false },
    { checklistName: "Windows functioning correctly", checklistStatus: false },
    { checklistName: "Tyres are in suitable condition", checklistStatus: false },
];
export const getChecklistItems = (userEmail) => {
    return checklistItems.map((item) => ({
        ...item,
        userEmail: userEmail,
    }));
}