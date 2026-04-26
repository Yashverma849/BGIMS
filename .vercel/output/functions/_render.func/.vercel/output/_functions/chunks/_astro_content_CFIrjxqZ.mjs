import { r as removeBase, i as isCoreRemotePath, V as VALID_INPUT_FORMATS, p as prependForwardSlash } from './astro/assets-service_BX5tYZ_r.mjs';
import { A as AstroError, p as UnknownContentCollectionError, d as createComponent, q as renderUniqueStylesheet, s as renderScriptElement, t as createHeadAndContent, r as renderComponent, e as renderTemplate, u as unescapeHTML } from './astro/server_B9KaNQD4.mjs';
import { u as unflatten } from './parse_CXBCSmuU.mjs';

var e=e=>Object.prototype.toString.call(e),t=e=>ArrayBuffer.isView(e)&&!(e instanceof DataView),o=t=>"[object Date]"===e(t),n=t=>"[object RegExp]"===e(t),r=t=>"[object Error]"===e(t),s=t=>"[object Boolean]"===e(t),l=t=>"[object Number]"===e(t),i=t=>"[object String]"===e(t),c=Array.isArray,u=Object.getOwnPropertyDescriptor,a=Object.prototype.propertyIsEnumerable,f=Object.getOwnPropertySymbols,p=Object.prototype.hasOwnProperty,h=Object.keys;function d(e){const t=h(e),o=f(e);for(let n=0;n<o.length;n++)a.call(e,o[n])&&t.push(o[n]);return t}function b(e,t){return !u(e,t)?.writable}function y(e,u){if("object"==typeof e&&null!==e){let a;if(c(e))a=[];else if(o(e))a=new Date(e.getTime?e.getTime():e);else if(n(e))a=new RegExp(e);else if(r(e))a={message:e.message};else if(s(e)||l(e)||i(e))a=Object(e);else {if(t(e))return e.slice();a=Object.create(Object.getPrototypeOf(e));}const f=u.includeSymbols?d:h;for(const t of f(e))a[t]=e[t];return a}return e}var g={includeSymbols:false,immutable:false};function m(e,t,o=g){const n=[],r=[];let s=true;const l=o.includeSymbols?d:h,i=!!o.immutable;return function e(u){const a=i?y(u,o):u,f={};let h=true;const d={node:a,node_:u,path:[].concat(n),parent:r[r.length-1],parents:r,key:n[n.length-1],isRoot:0===n.length,level:n.length,circular:void 0,isLeaf:false,notLeaf:true,notRoot:true,isFirst:false,isLast:false,update:function(e,t=false){d.isRoot||(d.parent.node[d.key]=e),d.node=e,t&&(h=false);},delete:function(e){delete d.parent.node[d.key],e&&(h=false);},remove:function(e){c(d.parent.node)?d.parent.node.splice(d.key,1):delete d.parent.node[d.key],e&&(h=false);},keys:null,before:function(e){f.before=e;},after:function(e){f.after=e;},pre:function(e){f.pre=e;},post:function(e){f.post=e;},stop:function(){s=false;},block:function(){h=false;}};if(!s)return d;function g(){if("object"==typeof d.node&&null!==d.node){d.keys&&d.node_===d.node||(d.keys=l(d.node)),d.isLeaf=0===d.keys.length;for(let e=0;e<r.length;e++)if(r[e].node_===u){d.circular=r[e];break}}else d.isLeaf=true,d.keys=null;d.notLeaf=!d.isLeaf,d.notRoot=!d.isRoot;}g();const m=t(d,d.node);if(void 0!==m&&d.update&&d.update(m),f.before&&f.before(d,d.node),!h)return d;if("object"==typeof d.node&&null!==d.node&&!d.circular){r.push(d),g();for(const[t,o]of Object.entries(d.keys??[])){n.push(o),f.pre&&f.pre(d,d.node[o],o);const r=e(d.node[o]);i&&p.call(d.node,o)&&!b(d.node,o)&&(d.node[o]=r.node),r.isLast=!!d.keys?.length&&+t==d.keys.length-1,r.isFirst=0==+t,f.post&&f.post(d,r),n.pop();}r.pop();}return f.after&&f.after(d,d.node),d}(e).node}var j=class{#e;#t;constructor(e,t=g){this.#e=e,this.#t=t;}get(e){let t=this.#e;for(let o=0;t&&o<e.length;o++){const n=e[o];if(!p.call(t,n)||!this.#t.includeSymbols&&"symbol"==typeof n)return;t=t[n];}return t}has(e){let t=this.#e;for(let o=0;t&&o<e.length;o++){const n=e[o];if(!p.call(t,n)||!this.#t.includeSymbols&&"symbol"==typeof n)return  false;t=t[n];}return  true}set(e,t){let o=this.#e,n=0;for(n=0;n<e.length-1;n++){const t=e[n];p.call(o,t)||(o[t]={}),o=o[t];}return o[e[n]]=t,t}map(e){return m(this.#e,e,{immutable:true,includeSymbols:!!this.#t.includeSymbols})}forEach(e){return this.#e=m(this.#e,e,this.#t),this.#e}reduce(e,t){const o=1===arguments.length;let n=o?this.#e:t;return this.forEach(((t,r)=>{t.isRoot&&o||(n=e(t,n,r));})),n}paths(){const e=[];return this.forEach((t=>{e.push(t.path);})),e}nodes(){const e=[];return this.forEach((t=>{e.push(t.node);})),e}clone(){const e=[],o=[],n=this.#t;return t(this.#e)?this.#e.slice():function t(r){for(let t=0;t<e.length;t++)if(e[t]===r)return o[t];if("object"==typeof r&&null!==r){const s=y(r,n);e.push(r),o.push(s);const l=n.includeSymbols?d:h;for(const e of l(r))s[e]=t(r[e]);return e.pop(),o.pop(),s}return r}(this.#e)}};

/*
How it works:
`this.#head` is an instance of `Node` which keeps track of its current value and nests another instance of `Node` that keeps the value that comes after it. When a value is provided to `.enqueue()`, the code needs to iterate through `this.#head`, going deeper and deeper to find the last value. However, iterating through every single item is slow. This problem is solved by saving a reference to the last value as `this.#tail` so that it can reference it to add a new value.
*/

class Node {
	value;
	next;

	constructor(value) {
		this.value = value;
	}
}

class Queue {
	#head;
	#tail;
	#size;

	constructor() {
		this.clear();
	}

	enqueue(value) {
		const node = new Node(value);

		if (this.#head) {
			this.#tail.next = node;
			this.#tail = node;
		} else {
			this.#head = node;
			this.#tail = node;
		}

		this.#size++;
	}

	dequeue() {
		const current = this.#head;
		if (!current) {
			return;
		}

		this.#head = this.#head.next;
		this.#size--;

		// Clean up tail reference when queue becomes empty
		if (!this.#head) {
			this.#tail = undefined;
		}

		return current.value;
	}

	peek() {
		if (!this.#head) {
			return;
		}

		return this.#head.value;

		// TODO: Node.js 18.
		// return this.#head?.value;
	}

	clear() {
		this.#head = undefined;
		this.#tail = undefined;
		this.#size = 0;
	}

	get size() {
		return this.#size;
	}

	* [Symbol.iterator]() {
		let current = this.#head;

		while (current) {
			yield current.value;
			current = current.next;
		}
	}

	* drain() {
		while (this.#head) {
			yield this.dequeue();
		}
	}
}

function pLimit(concurrency) {
	validateConcurrency(concurrency);

	const queue = new Queue();
	let activeCount = 0;

	const resumeNext = () => {
		if (activeCount < concurrency && queue.size > 0) {
			queue.dequeue()();
			// Since `pendingCount` has been decreased by one, increase `activeCount` by one.
			activeCount++;
		}
	};

	const next = () => {
		activeCount--;

		resumeNext();
	};

	const run = async (function_, resolve, arguments_) => {
		const result = (async () => function_(...arguments_))();

		resolve(result);

		try {
			await result;
		} catch {}

		next();
	};

	const enqueue = (function_, resolve, arguments_) => {
		// Queue `internalResolve` instead of the `run` function
		// to preserve asynchronous context.
		new Promise(internalResolve => {
			queue.enqueue(internalResolve);
		}).then(
			run.bind(undefined, function_, resolve, arguments_),
		);

		(async () => {
			// This function needs to wait until the next microtask before comparing
			// `activeCount` to `concurrency`, because `activeCount` is updated asynchronously
			// after the `internalResolve` function is dequeued and called. The comparison in the if-statement
			// needs to happen asynchronously as well to get an up-to-date value for `activeCount`.
			await Promise.resolve();

			if (activeCount < concurrency) {
				resumeNext();
			}
		})();
	};

	const generator = (function_, ...arguments_) => new Promise(resolve => {
		enqueue(function_, resolve, arguments_);
	});

	Object.defineProperties(generator, {
		activeCount: {
			get: () => activeCount,
		},
		pendingCount: {
			get: () => queue.size,
		},
		clearQueue: {
			value() {
				queue.clear();
			},
		},
		concurrency: {
			get: () => concurrency,

			set(newConcurrency) {
				validateConcurrency(newConcurrency);
				concurrency = newConcurrency;

				queueMicrotask(() => {
					// eslint-disable-next-line no-unmodified-loop-condition
					while (activeCount < concurrency && queue.size > 0) {
						resumeNext();
					}
				});
			},
		},
	});

	return generator;
}

function validateConcurrency(concurrency) {
	if (!((Number.isInteger(concurrency) || concurrency === Number.POSITIVE_INFINITY) && concurrency > 0)) {
		throw new TypeError('Expected `concurrency` to be a number from 1 and up');
	}
}

const CONTENT_IMAGE_FLAG = "astroContentImageFlag";
const IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";

function imageSrcToImportId(imageSrc, filePath) {
  imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
  if (isCoreRemotePath(imageSrc)) {
    return;
  }
  const ext = imageSrc.split(".").at(-1);
  if (!ext || !VALID_INPUT_FORMATS.includes(ext)) {
    return;
  }
  const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
  if (filePath) {
    params.set("importer", filePath);
  }
  return `${imageSrc}?${params.toString()}`;
}

class DataStore {
  _collections = /* @__PURE__ */ new Map();
  constructor() {
    this._collections = /* @__PURE__ */ new Map();
  }
  get(collectionName, key) {
    return this._collections.get(collectionName)?.get(String(key));
  }
  entries(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.entries()];
  }
  values(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.values()];
  }
  keys(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.keys()];
  }
  has(collectionName, key) {
    const collection = this._collections.get(collectionName);
    if (collection) {
      return collection.has(String(key));
    }
    return false;
  }
  hasCollection(collectionName) {
    return this._collections.has(collectionName);
  }
  collections() {
    return this._collections;
  }
  /**
   * Attempts to load a DataStore from the virtual module.
   * This only works in Vite.
   */
  static async fromModule() {
    try {
      const data = await import('./_astro_data-layer-content_BcEe_9wP.mjs');
      if (data.default instanceof Map) {
        return DataStore.fromMap(data.default);
      }
      const map = unflatten(data.default);
      return DataStore.fromMap(map);
    } catch {
    }
    return new DataStore();
  }
  static async fromMap(data) {
    const store = new DataStore();
    store._collections = data;
    return store;
  }
}
function dataStoreSingleton() {
  let instance = void 0;
  return {
    get: async () => {
      if (!instance) {
        instance = DataStore.fromModule();
      }
      return instance;
    },
    set: (store) => {
      instance = store;
    }
  };
}
const globalDataStore = dataStoreSingleton();

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://mmbgims.com", "SSR": true};
function createCollectionToGlobResultMap({
  globResult,
  contentDir
}) {
  const collectionToGlobResultMap = {};
  for (const key in globResult) {
    const keyRelativeToContentDir = key.replace(new RegExp(`^${contentDir}`), "");
    const segments = keyRelativeToContentDir.split("/");
    if (segments.length <= 1) continue;
    const collection = segments[0];
    collectionToGlobResultMap[collection] ??= {};
    collectionToGlobResultMap[collection][key] = globResult[key];
  }
  return collectionToGlobResultMap;
}
function createGetCollection({
  contentCollectionToEntryMap,
  dataCollectionToEntryMap,
  getRenderEntryImport,
  cacheEntriesByCollection
}) {
  return async function getCollection(collection, filter) {
    const hasFilter = typeof filter === "function";
    const store = await globalDataStore.get();
    let type;
    if (collection in contentCollectionToEntryMap) {
      type = "content";
    } else if (collection in dataCollectionToEntryMap) {
      type = "data";
    } else if (store.hasCollection(collection)) {
      const { default: imageAssetMap } = await import('./_astro_asset-imports_D9aVaOQr.mjs');
      const result = [];
      for (const rawEntry of store.values(collection)) {
        const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
        const entry = {
          ...rawEntry,
          data,
          collection
        };
        if (hasFilter && !filter(entry)) {
          continue;
        }
        result.push(entry);
      }
      return result;
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Ensure a collection directory with this name exists.`
      );
      return [];
    }
    const lazyImports = Object.values(
      type === "content" ? contentCollectionToEntryMap[collection] : dataCollectionToEntryMap[collection]
    );
    let entries = [];
    if (!Object.assign(__vite_import_meta_env__, {})?.DEV && cacheEntriesByCollection.has(collection)) {
      entries = cacheEntriesByCollection.get(collection);
    } else {
      const limit = pLimit(10);
      entries = await Promise.all(
        lazyImports.map(
          (lazyImport) => limit(async () => {
            const entry = await lazyImport();
            return type === "content" ? {
              id: entry.id,
              slug: entry.slug,
              body: entry.body,
              collection: entry.collection,
              data: entry.data,
              async render() {
                return render({
                  collection: entry.collection,
                  id: entry.id,
                  renderEntryImport: await getRenderEntryImport(collection, entry.slug)
                });
              }
            } : {
              id: entry.id,
              collection: entry.collection,
              data: entry.data
            };
          })
        )
      );
      cacheEntriesByCollection.set(collection, entries);
    }
    if (hasFilter) {
      return entries.filter(filter);
    } else {
      return entries.slice();
    }
  };
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
  return new j(data).map(function(ctx, val) {
    if (typeof val === "string" && val.startsWith(IMAGE_IMPORT_PREFIX)) {
      const src = val.replace(IMAGE_IMPORT_PREFIX, "");
      const id = imageSrcToImportId(src, fileName);
      if (!id) {
        ctx.update(src);
        return;
      }
      const imported = imageAssetMap?.get(id);
      if (imported) {
        ctx.update(imported);
      } else {
        ctx.update(src);
      }
    }
  });
}
async function render({
  collection,
  id,
  renderEntryImport
}) {
  const UnexpectedRenderError = new AstroError({
    ...UnknownContentCollectionError,
    message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
  });
  if (typeof renderEntryImport !== "function") throw UnexpectedRenderError;
  const baseMod = await renderEntryImport();
  if (baseMod == null || typeof baseMod !== "object") throw UnexpectedRenderError;
  const { default: defaultMod } = baseMod;
  if (isPropagatedAssetsModule(defaultMod)) {
    const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
    if (typeof getMod !== "function") throw UnexpectedRenderError;
    const propagationMod = await getMod();
    if (propagationMod == null || typeof propagationMod !== "object") throw UnexpectedRenderError;
    const Content = createComponent({
      factory(result, baseProps, slots) {
        let styles = "", links = "", scripts = "";
        if (Array.isArray(collectedStyles)) {
          styles = collectedStyles.map((style) => {
            return renderUniqueStylesheet(result, {
              type: "inline",
              content: style
            });
          }).join("");
        }
        if (Array.isArray(collectedLinks)) {
          links = collectedLinks.map((link) => {
            return renderUniqueStylesheet(result, {
              type: "external",
              src: prependForwardSlash(link)
            });
          }).join("");
        }
        if (Array.isArray(collectedScripts)) {
          scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
        }
        let props = baseProps;
        if (id.endsWith("mdx")) {
          props = {
            components: propagationMod.components ?? {},
            ...baseProps
          };
        }
        return createHeadAndContent(
          unescapeHTML(styles + links + scripts),
          renderTemplate`${renderComponent(
            result,
            "Content",
            propagationMod.Content,
            props,
            slots
          )}`
        );
      },
      propagation: "self"
    });
    return {
      Content,
      headings: propagationMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
    };
  } else if (baseMod.Content && typeof baseMod.Content === "function") {
    return {
      Content: baseMod.Content,
      headings: baseMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: baseMod.frontmatter ?? {}
    };
  } else {
    throw UnexpectedRenderError;
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}

// astro-head-inject

const contentDir = '/src/content/';

const contentEntryGlob = /* #__PURE__ */ Object.assign({});
const contentCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: contentEntryGlob,
	contentDir,
});

const dataEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/alumni/01-priya-deshmukh.json": () => import('./01-priya-deshmukh_Bj1IEe9g.mjs'),"/src/content/alumni/02-abhinay-patil.json": () => import('./02-abhinay-patil_QTXJK8QC.mjs'),"/src/content/alumni/03-tushar-shetty.json": () => import('./03-tushar-shetty_HIx70ORG.mjs'),"/src/content/alumni/04-kamika-chitre.json": () => import('./04-kamika-chitre_BejCQGC8.mjs'),"/src/content/alumni/05-rahul-gadge.json": () => import('./05-rahul-gadge_QJ8Spuw3.mjs'),"/src/content/alumni/06-jai-varadkar.json": () => import('./06-jai-varadkar_UlO605BE.mjs'),"/src/content/alumni/07-swapnita-mane.json": () => import('./07-swapnita-mane_KVir-3QG.mjs'),"/src/content/events/01-yoga-day.json": () => import('./01-yoga-day_zs9htbAB.mjs'),"/src/content/events/02-research-methodology.json": () => import('./02-research-methodology_DZ_qfBST.mjs'),"/src/content/events/03-versova-cleanup.json": () => import('./03-versova-cleanup_CyqDt6Wq.mjs'),"/src/content/events/04-earth-day.json": () => import('./04-earth-day_CgzR4pIn.mjs'),"/src/content/events/05-job-mela.json": () => import('./05-job-mela_BFoEgZJ4.mjs'),"/src/content/events/06-budget-panel.json": () => import('./06-budget-panel_Cw4jQ4Vb.mjs'),"/src/content/events/07-marathi-bhasha.json": () => import('./07-marathi-bhasha_DcaesnLT.mjs'),"/src/content/events/08-magma-2024.json": () => import('./08-magma-2024_phONWI7F.mjs'),"/src/content/events/09-food-fest.json": () => import('./09-food-fest_D5GPjPre.mjs'),"/src/content/events/10-rbi-visit.json": () => import('./10-rbi-visit_B1MsWjdR.mjs'),"/src/content/events/11-gd-training.json": () => import('./11-gd-training_CvC1J1uZ.mjs'),"/src/content/events/12-garba-jalsa.json": () => import('./12-garba-jalsa_PDa_LR_M.mjs'),"/src/content/faculty/advisory-anuradha-nair.json": () => import('./advisory-anuradha-nair_OJxUvy0N.mjs'),"/src/content/faculty/advisory-rohit-bhasin.json": () => import('./advisory-rohit-bhasin_C_la7V9S.mjs'),"/src/content/faculty/advisory-s-ramesh.json": () => import('./advisory-s-ramesh_vQPeLU0P.mjs'),"/src/content/faculty/amrita-tendulkar.json": () => import('./amrita-tendulkar_krckQZ0W.mjs'),"/src/content/faculty/aparna-shrotriya.json": () => import('./aparna-shrotriya_D5oiluiR.mjs'),"/src/content/faculty/director-vidya-hattangadi.json": () => import('./director-vidya-hattangadi_D6V8rWvL.mjs'),"/src/content/faculty/neha-mehta.json": () => import('./neha-mehta_DXhcOZCR.mjs'),"/src/content/faculty/priya-joshi.json": () => import('./priya-joshi_Cw4neI-e.mjs'),"/src/content/faculty/ratheesh-nair.json": () => import('./ratheesh-nair_VShzP6oF.mjs'),"/src/content/faculty/rohini-deshpande.json": () => import('./rohini-deshpande_DRFt-kAK.mjs'),"/src/content/faculty/sandeep-kulkarni.json": () => import('./sandeep-kulkarni_DZn21KwI.mjs'),"/src/content/faculty/visiting-falguni-nayar.json": () => import('./visiting-falguni-nayar_DX-HlGxO.mjs'),"/src/content/faculty/visiting-harsh-goenka.json": () => import('./visiting-harsh-goenka_BGp59Ar7.mjs'),"/src/content/faculty/visiting-kr-subramanian.json": () => import('./visiting-kr-subramanian_5xoUEYCg.mjs'),"/src/content/faculty/visiting-naina-lal-kidwai.json": () => import('./visiting-naina-lal-kidwai_COzwabSX.mjs'),"/src/content/faculty/visiting-nikhil-kamath.json": () => import('./visiting-nikhil-kamath_BzVd7ZSv.mjs'),"/src/content/faculty/visiting-r-gandhi.json": () => import('./visiting-r-gandhi_pwcY63RH.mjs'),"/src/content/faculty/visiting-sanjeev-bikhchandani.json": () => import('./visiting-sanjeev-bikhchandani_DVL3-r8p.mjs'),"/src/content/faculty/visiting-uday-kotak.json": () => import('./visiting-uday-kotak_BKaAUGUQ.mjs'),"/src/content/faculty/vivek-rajadhyaksha.json": () => import('./vivek-rajadhyaksha_Bi7UVy_b.mjs'),"/src/content/programmes/bms.json": () => import('./bms_DsJ73F8E.mjs'),"/src/content/programmes/mba-bf.json": () => import('./mba-bf_tPFEnAuT.mjs'),"/src/content/programmes/mms.json": () => import('./mms_CcACN_I_.mjs'),"/src/content/programmes/phd.json": () => import('./phd_D0m1fH7K.mjs')});
const dataCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: dataEntryGlob,
	contentDir,
});
createCollectionToGlobResultMap({
	globResult: { ...contentEntryGlob, ...dataEntryGlob },
	contentDir,
});

let lookupMap = {};
lookupMap = {"alumni":{"type":"data","entries":{"01-priya-deshmukh":"/src/content/alumni/01-priya-deshmukh.json","02-abhinay-patil":"/src/content/alumni/02-abhinay-patil.json","03-tushar-shetty":"/src/content/alumni/03-tushar-shetty.json","04-kamika-chitre":"/src/content/alumni/04-kamika-chitre.json","05-rahul-gadge":"/src/content/alumni/05-rahul-gadge.json","06-jai-varadkar":"/src/content/alumni/06-jai-varadkar.json","07-swapnita-mane":"/src/content/alumni/07-swapnita-mane.json"}},"programmes":{"type":"data","entries":{"bms":"/src/content/programmes/bms.json","mba-bf":"/src/content/programmes/mba-bf.json","mms":"/src/content/programmes/mms.json","phd":"/src/content/programmes/phd.json"}},"events":{"type":"data","entries":{"01-yoga-day":"/src/content/events/01-yoga-day.json","02-research-methodology":"/src/content/events/02-research-methodology.json","03-versova-cleanup":"/src/content/events/03-versova-cleanup.json","04-earth-day":"/src/content/events/04-earth-day.json","05-job-mela":"/src/content/events/05-job-mela.json","06-budget-panel":"/src/content/events/06-budget-panel.json","07-marathi-bhasha":"/src/content/events/07-marathi-bhasha.json","08-magma-2024":"/src/content/events/08-magma-2024.json","09-food-fest":"/src/content/events/09-food-fest.json","10-rbi-visit":"/src/content/events/10-rbi-visit.json","11-gd-training":"/src/content/events/11-gd-training.json","12-garba-jalsa":"/src/content/events/12-garba-jalsa.json"}},"faculty":{"type":"data","entries":{"advisory-anuradha-nair":"/src/content/faculty/advisory-anuradha-nair.json","advisory-rohit-bhasin":"/src/content/faculty/advisory-rohit-bhasin.json","advisory-s-ramesh":"/src/content/faculty/advisory-s-ramesh.json","amrita-tendulkar":"/src/content/faculty/amrita-tendulkar.json","aparna-shrotriya":"/src/content/faculty/aparna-shrotriya.json","director-vidya-hattangadi":"/src/content/faculty/director-vidya-hattangadi.json","neha-mehta":"/src/content/faculty/neha-mehta.json","priya-joshi":"/src/content/faculty/priya-joshi.json","ratheesh-nair":"/src/content/faculty/ratheesh-nair.json","rohini-deshpande":"/src/content/faculty/rohini-deshpande.json","sandeep-kulkarni":"/src/content/faculty/sandeep-kulkarni.json","visiting-falguni-nayar":"/src/content/faculty/visiting-falguni-nayar.json","visiting-harsh-goenka":"/src/content/faculty/visiting-harsh-goenka.json","visiting-kr-subramanian":"/src/content/faculty/visiting-kr-subramanian.json","visiting-naina-lal-kidwai":"/src/content/faculty/visiting-naina-lal-kidwai.json","visiting-nikhil-kamath":"/src/content/faculty/visiting-nikhil-kamath.json","visiting-r-gandhi":"/src/content/faculty/visiting-r-gandhi.json","visiting-sanjeev-bikhchandani":"/src/content/faculty/visiting-sanjeev-bikhchandani.json","visiting-uday-kotak":"/src/content/faculty/visiting-uday-kotak.json","vivek-rajadhyaksha":"/src/content/faculty/vivek-rajadhyaksha.json"}}};

new Set(Object.keys(lookupMap));

function createGlobLookup(glob) {
	return async (collection, lookupId) => {
		const filePath = lookupMap[collection]?.entries[lookupId];

		if (!filePath) return undefined;
		return glob[collection][filePath];
	};
}

const renderEntryGlob = /* #__PURE__ */ Object.assign({});
const collectionToRenderEntryMap = createCollectionToGlobResultMap({
	globResult: renderEntryGlob,
	contentDir,
});

const cacheEntriesByCollection = new Map();
const getCollection = createGetCollection({
	contentCollectionToEntryMap,
	dataCollectionToEntryMap,
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
	cacheEntriesByCollection,
});

export { getCollection as g };
