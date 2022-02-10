const {reminder} = require("./../utils/reminderAfter");

test("Update flash card reminder to be 8", () => {
    //Normal way
    expect(reminder(4)).toBe(8);
    //Default value
    expect(reminder(null)).toBe(21);
    //Passing String
    expect(reminder("4")).toBe(21);
})