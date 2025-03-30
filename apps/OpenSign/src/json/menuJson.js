export const subSetting = [
  {
    icon: "fa-light fa-sliders",
    title: "Preferences",
    target: "_self",
    pageType: "",
    description: "",
    objectId: "preferences"
  },
  {
    icon: "fa-light fa-users fa-fw",
    title: "Users",
    target: "_self",
    pageType: "",
    description: "",
    objectId: "users"
  }
];

const sidebarList = [
  {
    icon: "fa-light fa-tachometer-alt",
    title: "Dashboard",
    target: "",
    pageType: "dashboard",
    description: "",
    objectId: "35KBoSgoAK"
  },
  // {
  //   icon: "fa-light fa-pen-nib",
  //   title: "Sign yourself",
  //   target: "_self",
  //   pageType: "form",
  //   description: "",
  //   objectId: "sHAnZphf69"
  // },
  // {
  //   icon: "fa-light fa-paper-plane",
  //   title: "Request signatures",
  //   target: "_self",
  //   pageType: "form",
  //   description: "",
  //   objectId: "8mZzFxbG1z"
  // },
  {
    icon: "fa-light fa-pen-fancy",
    title: "Signature",
    target: "_self",
    pageType: null,
    description: null,
    objectId: null,
    children: [
      // {
      //   icon: "fa-light fa-file-signature",
      //   title: "Create template",
      //   target: "_self",
      //   pageType: "form",
      //   description: "",
      //   objectId: "template"
      // },
      {
        icon: "fa-light fa-pen-nib",
        title: "Sign yourself",
        target: "_self",
        pageType: "form",
        description: "",
        objectId: "sHAnZphf69"
      },
      {
        icon: "fa-light fa-paper-plane",
        title: "Request signatures",
        target: "_self",
        pageType: "form",
        description: "",
        objectId: "8mZzFxbG1z"
      },
      {
        icon: "fa-light fa-file-contract",
        title: "Templates",
        target: "_self",
        pageType: "report",
        description: "",
        objectId: "6TeaPr321t"
      },
    ]
  },
  {
    icon: "fa-light fa-folder",
    title: "My Drive",
    target: "_self",
    pageType: "",
    description: "",
    objectId: "mydrive"
  },
  {
    icon: "fa-light fa-address-card",
    title: "My Documents",
    target: "_self",
    pageType: null,
    description: "",
    objectId: null,
    children: [
      {
        icon: "fa-light fa-signature",
        title: "Need your sign",
        target: "_self",
        pageType: "report",
        description: "",
        objectId: "4Hhwbp482K"
      },
      {
        icon: "fa-light fa-tasks",
        title: "In Progress",
        target: "_self",
        pageType: "report",
        description: "",
        objectId: "1MwEuxLEkF"
      },
      {
        icon: "fa-light fa-check-circle",
        title: "Completed",
        target: "_self",
        pageType: "report",
        description: "",
        objectId: "kQUoW4hUXz"
      },
      {
        icon: "fa-light fa-edit",
        title: "Drafts",
        target: "_self",
        pageType: "report",
        description: "",
        objectId: "ByHuevtCFY"
      },
      {
        icon: "fa-light fa-times-circle",
        title: "Declined",
        target: "_self",
        pageType: "report",
        description: "",
        objectId: "UPr2Fm5WY3"
      },
      {
        icon: "fa-light fa-hourglass-end",
        title: "Expired",
        target: "_self",
        pageType: "report",
        description: "",
        objectId: "zNqBHXHsYH"
      }
    ]
  },
  // {
  //   icon: "fa-light fa-address-book",
  //   title: "Contactbook",
  //   target: "_self",
  //   pageType: "report",
  //   description: "",
  //   objectId: "contacts"
  // },
  {
    icon: "fa-light fa-money-bills",
    title: "Billing",
    target: "_self",
    pageType: null,
    description: null,
    objectId: null,
    children: [
      {
        icon: "fa-light fa-wallet",
        title: "Wallet",
        target: "_self",
        pageType: "wallet",
        description: "",
        objectId: ""
      },
      {
        icon: "fa-light fa-file-invoice-dollar",
        title: "Billing",
        target: "_self",
        pageType: "monthlybills",
        description: "",
        objectId: ""
      },
      {
        icon: "fa-light fa-scroll",
        title: "Transactions",
        target: "_self",
        pageType: "transaction",
        description: "",
        objectId: ""
      },
    ]
  },
  // {
  //   icon: "fa-light fa-cog",
  //   title: "Settings",
  //   target: "_self",
  //   pageType: null,
  //   description: "",
  //   objectId: null,
  //   children: [
  //     {
  //       icon: "fa-light fa-pen-fancy",
  //       title: "My Signature",
  //       target: "_self",
  //       pageType: "",
  //       description: "",
  //       objectId: "managesign"
  //     },
  //     {
  //       icon: "fa-light fa-key",
  //       title: "API Token",
  //       target: "_self",
  //       pageType: "",
  //       description: "",
  //       objectId: "generatetoken"
  //     },
  //     {
  //       icon: "fa-light fa-globe",
  //       title: "Webhook",
  //       target: "_self",
  //       pageType: "",
  //       description: "",
  //       objectId: "webhook"
  //     }
  //   ]
  // }
];
export default sidebarList;
