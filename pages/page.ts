import fs from "node:fs";

import { createLoadHook } from "elegance-js/server/loadHook";
import { createState } from "elegance-js/server/createState";
import { observe } from "elegance-js/server/observe";

const header = createState({ isShowing: false, })

createLoadHook({
    fn: (state, header) => {
        const socials = document.getElementById("socials") as HTMLDivElement;
        if (!socials) return;
        
        const rect = socials.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        
        const el = () => {
            if (window.scrollY > top) {
                header.value.isShowing = true;
                header.signal();
            } else {
                header.value.isShowing = false;
                header.signal();
            }
        };
        
        document.addEventListener("scroll", el);
        
        return () => {
            document.removeEventListener("scroll", el);
        };
    },
    
    deps: [header],
})

const files = fs.readdirSync("./public/works")

const Header = () => div({
    class: observe(
        [header],
        (header) => {
            let classList = "z-[1000] duration-200 fixed left-0 right-0 h-12 bg-[#000000cc] backdrop-blur-md";
            
            if (header.isShowing) {
                classList += " top-0"
            } else {
                classList += " -top-full"
            }
            
            return classList;
        },
    ),
},
    div({
        class: "flex h-full items-center pl-4 text-white justify-between",
    },
        h2({ class: "uppercase font-bold  tracking-widest"}, "WHYNOTGEORGE"),
        
        div({
            class: "flex items-center",
        },
        
        a ({
            target: "_blank",
            href: "https://x.com/hainotogeo",
        },
            img({
                src: "/images/x-logo.png",
                class: "invert-100",
                height: 22,
                width: 22,
            }),
        ),
        
        a ({
            target: "_blank",
            href: "https://youtube.com/@whynotgeorg",
        },
            img({
                src: "/images/youtube-logo.png",
                class: "invert-100 ml-3",
                height: 44,
                width: 44,
            }),
        ),
        a ({
            target: "_blank",
            href: "https://www.artstation.com/whynotgeorge",
        },    
            img({
                src: "/images/artstation-logo.svg",
                height: 46,
                width: 46,
            }),
        ),
        ),
    ),
);

const Hero = () => div({
    class: "px-2 sm:p-20 md:p-24 flex items-center flex-col gap-8 sm:gap-20 md:gap-24 h-full min-h-screen",
},
    div({
        class: "absolute inset-0 -z-10 noise",
    }),
    
    h1({
        class: "pt-8 text-3xl sm:text-6xl md:text-7xl font-bold tracking-widest",
    },
        "WHYNOTGEORGE"
    ),
    
    div({
        class: "flex flex-wrap gap-2 justify-evenly w-full sm:pb-12 px-2",
        id: "socials",
    },
        a ({
            class: "flex gap-2 items-center hover:opacity-60 duration-200",
            target: "_blank",
            href: "https://x.com/hainotogeo",
        },
            img({
                src: "/images/x-logo.png",
                height: 22,
                width: 22,
            }),
            
            span({ class: "font-semibold text-sm", }, "Twitter (X)")
        ),
        
        a ({
            class: "flex gap-1 items-center",
            target: "_blank",
            href: "https://youtube.com/@whynotgeorg",
        },
            img({
                src: "/images/youtube-logo.png",
                height: 44,
                width: 44,
            }),
            
            span({ class: "font-semibold text-sm", }, "Youtube")
        ),
        
        a ({
            class: "flex gap-0 items-center",
            target: "_blank",
            href: "https://www.artstation.com/whynotgeorge",
        },
            img({
                src: "/images/artstation-logo.svg",
                height: 46,
                width: 46,
            }),
            
            span({ class: "font-semibold text-sm", }, "Artstation")
        ),
        
    ),
    
    p({
        class: "sm:text-lg md:text-xl sm:text-center sm:pb-12 sm:p-0 p-2",
    },
        "Hey, I'm a 20-year-old independent illustrator based in Europe.",
        br(),
        "I specialize in character illustrations, creating both fan art and original designs."
    ),
    
    div ({
        class: "mosaic-grid",
    },
        ...files.map(file => div({
            
        },
            img({
                src: "/works/" + file,
            }),
        ))
    ),
)

const Tag = () => div({
    class: "flex flex-col gap-2 items-center p-20",
},
    p({ 
        class: "text-center mb-4", 
    }, 
        "© 2025 WhyNotGeorge",
        br(),
        "All Rights Reserved."
    ),
    
    a({
        class: "border-b-2 hover:opacity-60 duration-200",
        target: "_blank",
        href: "https://val.sh/",
    },
        "Website by Valdemar.",
    ),
)

export const page = body({
    class: "text-text-950 bg-background-50 relative min-h-screen min-w-screen font-inter",
},
    Header(),
    
    Hero(),
    
    Tag(),
);

export const metadata = () => head({},
    link({
        rel: "stylesheet",
        href: "/index.css",
    }),
    
    title({}, "WhyNotGeorge"),
    
    meta({
        charset: "UTF-8",
    }),
    
    meta({
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
    }),
    
    meta({
        property: "og:title",
    }, "WhyNotGeorge"),
    
    meta({
        property: "og:description",
        content: "My name is George, I am 20 year old independent illustrator from europe. My works mostly consist of character illustrations, fanart and original characters.",
    }),
    
    meta({
        property: "og:type",
        content: "",
    }),
    
    meta({
        property: "og:url",
        content: "https://whynotgeorge.art",
    }),
    
    meta({
        property: "og:image",
        content: "https://whynotgeorge.art/works/sd.png",
    }),
    
    meta({
        property: "og:site_name",
        content: "WhyNotGeorge",
    }),
    
    meta({
        name: "twitter:card",
        content: "",
    }),
    
    meta({
        name: "twitter:title",
        content: "",
    }),
    
    meta({
        name: "twitter:description",
        content: "",
    }),
    
    meta({
        name: "twitter:image",
        content: "",
    }),
    
    meta({}),
)