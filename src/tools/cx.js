/**
 * This tool is used to apply class names in specific ways based on the boolean-ness of certain values
 *
 * @param  {...any} args CX takes in arguments of the form ['picture', darkMode && 'dark', mobile && 'isMobile]
 * @returns "picture dark" (darkMode is true, isMobile is false
 */
function cx(...args) {
    return args.filter(
        (element) => {
            return typeof element === 'string';
        }
    ).join(" ")
}

export default cx;
