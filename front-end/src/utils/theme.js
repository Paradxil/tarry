// export const colors = [
//     '#ff8787',
//     '#f783ac',
//     '#da77f2',
//     '#9775fa',
//     '#748ffc',
//     '#4dabf7',
//     '#3bc9db',
//     '#38d9a9',
//     '#69db7c',
//     '#a9e34b',
//     '#ffd43b',
//     '#ffa94d'
// ]
export const color_to_css_var = function(color, brightness=4) {
    return "var(--oc-" + color + "-" + brightness + ")";
}
export const colors = ['gray', 'red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange'];
export const hex_codes = colors.map((c)=>{return color_to_css_var(c, 4)});
export const light_hex_codes = colors.map((c)=>{return color_to_css_var(c, 2)});
export const dark_hex_codes = colors.map((c)=>{return color_to_css_var(c, 6)});
export const colors_list = colors.map((c) =>{return {color: color_to_css_var(c, 4), value: c}})
