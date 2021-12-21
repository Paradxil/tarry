export function applySettings() {
    let primaryColor = window.sessionStorage.getItem("primary-color");
    console.log(primaryColor);
    if(primaryColor != null) {
        document.querySelector(':root').style.setProperty('--secondary', 'var(--oc-'+primaryColor+'-4)');
        document.querySelector(':root').style.setProperty('--secondary-dark', 'var(--oc-'+primaryColor+'-6)');
        document.querySelector(':root').style.setProperty('--secondary-light', 'var(--oc-'+primaryColor+'-2)');
    }

    let secondaryColor = window.sessionStorage.getItem("secondary-color");
    if(secondaryColor != null) {
        document.querySelector(':root').style.setProperty('--tertiary', 'var(--oc-'+secondaryColor+'-4)');
        document.querySelector(':root').style.setProperty('--tertiary-dark', 'var(--oc-'+secondaryColor+'-6)');
        document.querySelector(':root').style.setProperty('--tertiary-light', 'var(--oc-'+secondaryColor+'-2)');
    }
};