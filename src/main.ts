import { defineCustomElement } from "vue";
import ConnexeArticleCe from "./components/connexe-article.vue";
import ConnexeDevCe from "./components/connexe-dev.vue";

const ConnexeArticle = defineCustomElement(ConnexeArticleCe);
const ConnexeDev = defineCustomElement(ConnexeDevCe);

customElements.define("connexe-article", ConnexeArticle);
customElements.define("connexe-dev", ConnexeDev);
