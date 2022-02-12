exports.reminder = (currentReminder) => {
    let updatedReminder = 0;
    currentReminder = Number(currentReminder);
    switch(currentReminder){
        case 1:
            updatedReminder = 2;
            break;
        case 2:
            updatedReminder = 4;
            break;
        case 4:
            updatedReminder = 8;
            break;
        case 8:
            updatedReminder = 14;
            break;
        case 14:
            updatedReminder = 21; 
            break;
        default:
            updatedReminder = currentReminder; 
    }
    return updatedReminder;
}