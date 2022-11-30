// input: ['picture', darkMode && 'dark', mobile && 'isMobile]
// output: "picture dark" (darkMode is true, isMobile is false
function cx(...args) {
    return args.filter(
        (element) => {
            return typeof element === 'string';
        }
    ).join(" ")
}

export default cx;