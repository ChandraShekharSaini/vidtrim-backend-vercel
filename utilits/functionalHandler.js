

export const generateRandomName = () => {
    const adjectives = ["Swift", "Clever", "Brave", "Happy", "Calm"];
    const nouns = ["Tiger", "Eagle", "Dolphin", "Panda", "Wolf"];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(100 + Math.random() * 900);
    return `${randomAdjective}${randomNoun}${randomNumber}`;
};

export const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const passwordLength = 12;
    let password = "";
    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }
    return password;
};
