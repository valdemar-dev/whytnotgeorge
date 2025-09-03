import fs from "node:fs";

const files = fs.readdirSync("./public/works")

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
    
    p({
        class: "text-lg sm:text-xl font-semibold text-center",
    },
        "My name is George, I am 20 year old independent illustrator from Europe.",
        br(),
        "My works mostly consist of character illustrations, fanart and original characters."
    ),
    
    div({
        class: "flex flex-wrap gap-2 justify-evenly w-full sm:mb-12",
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
    a({
        class: "border-b-2 hover:opacity-60 duration-200",
        target: "_blank",
        href: "https://val.sh/",
    },
        "Made by Valdemar.",
    ),
    
    span("© 2025. All Rights Reserved."),
)

export const page = body({
    class: "text-text-950 bg-background-50 relative min-h-screen min-w-screen font-inter",
},
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
        content: "/public/Illustration96.png",
    }),
    
    meta({
        property: "og:site_name",
        content: "",
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