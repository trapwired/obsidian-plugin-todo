export enum Icon {
    Inbox,
    Reveal,
    Scheduled,
    Someday,
    Today,
    Upcoming,
    WithoutDate,
    Waiting
}

export const RenderIcon = (icon: Icon, title = '', description = ''): HTMLElement => {
    const svg = svgForIcon(icon)(title, description);
    return parser.parseFromString(svg, 'text/xml').documentElement;
};

const parser = new DOMParser();

const svgForIcon = (icon: Icon): ((arg0: string, arg1: string) => string) => {
  switch (icon) {
    case Icon.Inbox:
      return inboxIcon;
    case Icon.Reveal:
      return revealIcon;
    case Icon.Scheduled:
      return scheduledIcon;
    case Icon.Someday:
      return somedayIcon;
    case Icon.Today:
      return todayIcon;
    case Icon.Upcoming:
      return scheduledIcon;
    case Icon.WithoutDate:
      return inboxIcon;
    case Icon.Waiting:
      return waitingIcon;
  }
};

const inboxIcon = (title: string, description: string): string => `
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" aria-label="${title + description}">
  <title>${title}</title>
  <description>${description}</description>
  <path d="M0 0h24v24H0V0z" fill="none"/>
  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5v-3h3.56c.69 1.19 1.97 2 3.45 2s2.75-.81 3.45-2H19v3zm0-5h-4.99c0 1.1-.9 2-2 2s-2-.9-2-2H5V5h14v9z"/>
</svg>
`;

const revealIcon = (title: string, description: string): string => `
<svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24" role="img" aria-label="${
    title + description
}">
  <title>${title}</title>
  <description>${description}</description>
  <rect fill="none" height="24" width="24"/><path d="M9,5v2h6.59L4,18.59L5.41,20L17,8.41V15h2V5H9z"/>
</svg>
`;

const scheduledIcon = (title: string, description: string): string => `
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" aria-label="${title + description}">
  <title>${title}</title>
  <description>${description}</description>
  <path d="M0 0h24v24H0V0z" fill="none"/>
  <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V10h16v11zm0-13H4V5h16v3z"/>
</svg>
`;

const somedayIcon = (title: string, description: string): string => `
<svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24" aria-label="${
    title + description
}">
  <title>${title}</title>
  <description>${description}</description>
  <g><rect fill="none" height="24" width="24"/></g>
  <g><g><path d="M20,2H4C3,2,2,2.9,2,4v3.01C2,7.73,2.43,8.35,3,8.7V20c0,1.1,1.1,2,2,2h14c0.9,0,2-0.9,2-2V8.7c0.57-0.35,1-0.97,1-1.69V4 C22,2.9,21,2,20,2z M19,20H5V9h14V20z M20,7H4V4h16V7z"/><rect height="2" width="6" x="9" y="12"/></g></g>
</svg>
`;

const todayIcon = (title: string, description: string): string => `
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" aria-label="${title + description}">
  <title>${title}</title>
  <description>${description}</description>
  <path d="M0 0h24v24H0V0z" fill="none"/>
  <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
</svg>
`;

const waitingIcon = (title: string, description: string): string => `
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" aria-label="${title + description}">
  <title>${title}</title>
  <description>${description}</description>
  <path d="M0 0h24v24H0V0z" fill="none"/>
  <path d="M 14.878 11.364 L 13.855 12.016 L 14.878 12.669 C 17.015 14.031 18.342 16.747 18.342 19.756 C 18.342 20.054 18.329 20.351 18.303 20.646 L 5.816 20.646 C 5.789 20.351 5.776 20.054 5.776 19.756 C 5.776 16.747 7.104 14.031 9.241 12.669 L 10.263 12.016 L 9.241 11.364 C 7.104 10.001 5.776 7.286 5.776 4.276 C 5.776 3.874 5.802 3.473 5.849 3.077 L 18.269 3.077 C 18.317 3.473 18.342 3.874 18.342 4.276 C 18.342 7.286 17.015 10.001 14.878 11.364 Z M 21.486 2.148 L 21.486 1.142 C 21.486 0.631 21.034 0.213 20.48 0.213 L 3.722 0.213 C 3.169 0.213 2.716 0.631 2.716 1.142 L 2.716 2.148 C 2.716 2.659 3.169 3.077 3.722 3.077 L 4.287 3.077 C 4.245 3.474 4.225 3.875 4.225 4.276 C 4.225 7.388 5.467 10.254 7.526 12.016 C 5.467 13.778 4.225 16.644 4.225 19.756 C 4.225 20.053 4.237 20.351 4.259 20.646 L 3.638 20.646 C 3.085 20.646 2.632 21.064 2.632 21.575 L 2.632 22.581 C 2.632 23.092 3.085 23.51 3.638 23.51 L 20.396 23.51 C 20.95 23.51 21.402 23.092 21.402 22.581 L 21.402 21.575 C 21.402 21.064 20.95 20.646 20.396 20.646 L 19.859 20.646 C 19.882 20.351 19.894 20.053 19.894 19.756 C 19.894 16.644 18.651 13.778 16.592 12.016 C 18.651 10.254 19.894 7.388 19.894 4.276 C 19.894 3.875 19.872 3.474 19.831 3.077 L 20.48 3.077 C 21.034 3.077 21.486 2.659 21.486 2.148" style="transform-origin: 0.747px -2.123px;" id="path-2"/>
  <path d="M 11.843 11.38 C 15.022 10.981 15.899 8.244 15.899 8.244 L 8.445 8.244 C 8.52 10.239 11.843 11.38 11.843 11.38" style="transform-origin: 7.7px 8.243px;" id="path14"/>
  <path d="M 7.21 19.492 L 17.152 19.492 C 17.152 19.492 16.969 15.519 12.182 12.846 C 12.182 12.846 7.302 15.29 7.21 19.492" style="transform-origin: 12.2393px 12.8538px;" id="path16"/>
</svg>
`;
