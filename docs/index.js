const startCapitalCharCode = 65;
const endCapitalCharCode = 90;
const startCharCode = 97;
const endCharCode = 122;
const iconContainerMap = new Map();
const defaultDocTitle = document.title;

let currentUrl = new URL(location.href);

function onLoad() {
    const iconGroup = new Map();

    iconContainerNames = document.querySelectorAll('.IconContainer-name').forEach(div => {
        const iconName = div.innerText.trim();

        iconContainerMap.set(iconName, div.parentElement);

        let keyword = undefined;
        let hasNormalLetter = false;

        for(let i = 0; i< iconName.length; i++) {
            const char = iconName[i];
            const charCode = char.charCodeAt(0);

            if(keyword === undefined) {
                if(charCode < startCapitalCharCode || charCode > endCapitalCharCode) continue;

                // Start keyword
                keyword = char;
                hasNormalLetter = false;
            }
            else if(charCode < startCharCode || charCode > endCharCode) {
                if(hasNormalLetter) {
                    if(iconGroup.has(keyword)) {
                        iconGroup.set(keyword, iconGroup.get(keyword) + 1);
                    }
                    else {
                        iconGroup.set(keyword, 1);
                    }
                }

                keyword = undefined;
                continue;
            }
            else {
                keyword += char;
                hasNormalLetter = true;
            }
        }
    });
    
    const sortedKeywords = Array.from(iconGroup.entries()).sort((a,b) => b[1] - a[1]);
    const datalistElement = document.createElement('datalist');
    datalistElement.id = 'iconKeyword';

    sortedKeywords.forEach(keyword => {
        const optionElement = document.createElement('option');
        optionElement.innerText = keyword[0];

        datalistElement.appendChild(optionElement);
    });

    document.body.appendChild(datalistElement);

    restoreSearchValue();
}

function restoreSearchValue() {
    const searchKeyword = currentUrl.searchParams.get('search') || '';
    const currentSearch = search.value;
    
    if(searchKeyword === search.value) return;

    search.value = searchKeyword;
    onFilterChanged();
}

function onPopState(e) {
    currentUrl = new URL(location.href);
    restoreSearchValue();
}

function autoFocus(){
    search.select();
}

function onFilterChanged(e) {
    const keyword = search.value.trim();
    const isEmpty = keyword === '';    
    const tokens = keyword.split(' ');
    let isMatchFn;

    if(isEmpty) {
        isMatchFn = () => true;
    }
    else if(tokens.length === 1) {
        isMatchFn = (iconName) => iconName.includes(keyword);
    }
    else {
        isMatchFn = (iconName) => tokens.every(x => iconName.includes(x));
    }

    iconContainerMap.forEach((iconContainer, iconName) => {
        iconContainer.hidden = !isMatchFn(iconName);
    });

    if(e !== undefined){ 
        // Triggered from change event
        if(isEmpty) {
            currentUrl.searchParams.delete('search');
        }
        else {
            currentUrl.searchParams.set('search', keyword);
        }

        history.pushState(undefined, '', currentUrl.href);
    }

    if(isEmpty) {
        document.title = defaultDocTitle;
    }
    else {
        document.title = keyword + ' - ' + defaultDocTitle;
    }
}

window.addEventListener('load', onLoad);
window.addEventListener('popstate', onPopState);
search.addEventListener('focus', autoFocus);
search.addEventListener('change', onFilterChanged);