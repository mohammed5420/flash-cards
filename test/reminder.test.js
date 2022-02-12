const {reminder} = require("./../utils/reminderAfter");

test("Update flash card reminder", () => {
    //Normal way
    expect(reminder(4)).toBe(8);
})

test("update flash card reminder by passing null values",() => {
        //Default value
        expect(reminder({name: "mohammed"})).toBe(21);
})

test("update flash card reminder by passing wrong data types",() => {
    //Passing String
    expect(reminder("4")).toBe(8);
})