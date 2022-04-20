import{_ as a,c as n,o as e,a as t}from"./app.2d2adcca.js";const s='{"title":"Custom Configuration","description":"","frontmatter":{"title":"Custom Configuration","date":"2022-04-15T00:00:00.000Z","author":"Simple Blog","twitter":"@huchengye"},"headers":[{"level":2,"title":"introduce","slug":"introduce"},{"level":2,"title":"Example","slug":"example"},{"level":2,"title":"source code","slug":"source-code"},{"level":2,"title":"Download project & install dependencies","slug":"download-project-install-dependencies"},{"level":2,"title":"Change setting","slug":"change-setting"},{"level":3,"title":"Modify config.ts","slug":"modify-config-ts"},{"level":3,"title":"Modify logo","slug":"modify-logo"},{"level":3,"title":"Modify About page","slug":"modify-about-page"},{"level":3,"title":"Modify the Projects page","slug":"modify-the-projects-page"},{"level":3,"title":"Add blog","slug":"add-blog"},{"level":3,"title":"detail","slug":"detail"},{"level":2,"title":"deploy","slug":"deploy"}],"relativePath":"posts/en-config.md"}',o={},p=[t('<p>Simple theme blog template based on <a href="https://vitepress.docschina.org/" target="_blank" rel="noopener noreferrer">Vitepress</a>.</p><p>The simplest theme style is used to complete a blog template with complete functions.</p><ul><li>Has a custom About page</li><li>Have a simple Blog page</li><li>Has a simple Project page</li></ul><hr><h2 id="introduce" tabindex="-1">introduce <a class="header-anchor" href="#introduce" aria-hidden="true">#</a></h2><p>Simple theme blog template using <a href="https://vitepress.docschina.org/" target="_blank" rel="noopener noreferrer">Vitepress</a>.</p><h2 id="example" tabindex="-1">Example <a class="header-anchor" href="#example" aria-hidden="true">#</a></h2><p><a href="https://elonehoo.xyz" target="_blank" rel="noopener noreferrer">personal example</a></p><p>What you see now is what this blog looks like. Continue reading the documentation if you like. Configure this theme as your blog.</p><h2 id="source-code" tabindex="-1">source code <a class="header-anchor" href="#source-code" aria-hidden="true">#</a></h2><ul><li><a href="https://github.com/elonehoo/vitepress-theme-simple" target="_blank" rel="noopener noreferrer">GitHub</a></li></ul><h2 id="download-project-install-dependencies" tabindex="-1">Download project &amp; install dependencies <a class="header-anchor" href="#download-project-install-dependencies" aria-hidden="true">#</a></h2><div class="language-bash"><pre><code><span class="token comment"># Install</span>\n<span class="token function">git</span> clone git@github.com:elonehoo/vitepress-theme-simple.git\n\n<span class="token comment"># Enter the project directory</span>\n<span class="token builtin class-name">cd</span> vitepress-theme-simple\n\n<span class="token comment"># install dependencies</span>\n<span class="token function">pnpm</span> <span class="token function">install</span>\n</code></pre></div><h2 id="change-setting" tabindex="-1">Change setting <a class="header-anchor" href="#change-setting" aria-hidden="true">#</a></h2><h3 id="modify-config-ts" tabindex="-1">Modify <code>config.ts</code> <a class="header-anchor" href="#modify-config-ts" aria-hidden="true">#</a></h3><div class="language-ts"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> defineConfig <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vitepress&#39;</span>\n\n<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineConfig</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  base<span class="token operator">:</span><span class="token string">&#39;/&#39;</span><span class="token punctuation">,</span>\n  title<span class="token operator">:</span> <span class="token string">&#39;Simple&#39;</span><span class="token punctuation">,</span>\n  description<span class="token operator">:</span> <span class="token string">&quot;vitepress theme simple&quot;</span><span class="token punctuation">,</span>\n  head<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token punctuation">[</span>\n      <span class="token string">&#39;link&#39;</span><span class="token punctuation">,</span>\n      <span class="token punctuation">{</span>\n        rel<span class="token operator">:</span> <span class="token string">&#39;icon&#39;</span><span class="token punctuation">,</span>\n        type<span class="token operator">:</span> <span class="token string">&#39;image/x-icon&#39;</span><span class="token punctuation">,</span>\n        href<span class="token operator">:</span> <span class="token string">&#39;/logo.svg&#39;</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">]</span><span class="token punctuation">,</span>\n  vite<span class="token operator">:</span> <span class="token punctuation">{</span>\n    build<span class="token operator">:</span> <span class="token punctuation">{</span>\n      minify<span class="token operator">:</span> <span class="token string">&#39;terser&#39;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre></div><h4 id="base" tabindex="-1">base <a class="header-anchor" href="#base" aria-hidden="true">#</a></h4><p>If you need to put this project under the <code>username.github.io</code> repository, no changes are required.</p><p>If you need to put this project in another repository, you need to change the <code>base</code> option to the name of the repository.</p><h4 id="title" tabindex="-1">title <a class="header-anchor" href="#title" aria-hidden="true">#</a></h4><p>The title of the website. All page titles will have this suffix.</p><h4 id="description" tabindex="-1">description <a class="header-anchor" href="#description" aria-hidden="true">#</a></h4><p>A description of the site. This will be rendered as a <meta> tag in the HTML page.</p><h3 id="modify-logo" tabindex="-1">Modify logo <a class="header-anchor" href="#modify-logo" aria-hidden="true">#</a></h3><p>Lgoo chooses to use SVG as the logo file type as much as possible. <code>logo.svg</code> is stored in the public file, and the icon of the blog can be modified by modifying this file.</p><h3 id="modify-about-page" tabindex="-1">Modify About page <a class="header-anchor" href="#modify-about-page" aria-hidden="true">#</a></h3><div class="language-markdown"><pre><code><span class="token front-matter-block"><span class="token punctuation">---</span>\n<span class="token front-matter yaml language-yaml">englishName: your english name\norganizeLink: your github organize link\norganizeName: your github organize name\ngithubLink: your github link\nspeakLanguage: your speak language\nlanguageName: your language name\nlanguagePronunciation: you language name pronunciation\ntitle: About</span>\n<span class="token punctuation">---</span></span>\n</code></pre></div><p>If there is a better design or a better template for you to choose, you can directly modify the code in the <code>.vitepress/theme/Me.vue</code> file.</p><h3 id="modify-the-projects-page" tabindex="-1">Modify the Projects page <a class="header-anchor" href="#modify-the-projects-page" aria-hidden="true">#</a></h3><p>This is one of the pages I&#39;m more satisfied with, so let me explain in advance that if you have better ideas, you can directly modify the code in the <code>.vitepress/theme/Projects.vue</code> file.</p><h4 id="add-item" tabindex="-1">Add item <a class="header-anchor" href="#add-item" aria-hidden="true">#</a></h4><p>You can add your own projects in <code>projects.md</code>, e.g.</p><div class="language-markdown"><pre><code>projects:\n  project groups name:\n    <span class="token list punctuation">-</span> name: &#39;your project name&#39;\n      link: &#39;your project link&#39;\n      desc: &#39;your project description&#39;\n      icon: &#39;your project icon&#39;\n</code></pre></div><h4 id="add-item-icon" tabindex="-1">Add item icon <a class="header-anchor" href="#add-item-icon" aria-hidden="true">#</a></h4><p>Add an icon <code>*.vue</code> file under <code>.vitepress/theme/icon/</code>, the example is as follows</p><div class="language-vue"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>svg</span> <span class="token attr-name">t</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>1649992137654<span class="token punctuation">&quot;</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>icon<span class="token punctuation">&quot;</span></span> <span class="token attr-name">viewBox</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>0 0 1024 1024<span class="token punctuation">&quot;</span></span> <span class="token attr-name">version</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>1.1<span class="token punctuation">&quot;</span></span> <span class="token attr-name">xmlns</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>http://www.w3.org/2000/svg<span class="token punctuation">&quot;</span></span> <span class="token attr-name">p-id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>3794<span class="token punctuation">&quot;</span></span> <span class="token attr-name">width</span> <span class="token attr-value"><span class="token punctuation attr-equals">=</span> <span class="token punctuation">&quot;</span>48<span class="token punctuation">&quot;</span></span> <span class="token attr-name">height</span> <span class="token attr-value"><span class="token punctuation attr-equals">=</span> <span class="token punctuation">&quot;</span>48<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>path</span> <span class="token attr-name">d</span> <span class="token attr-value"><span class="token punctuation attr-equals">=</span> <span class="token punctuation">&quot;</span>M554.666667 725.333333v-85.333333h-85.333334v85.333333h85.333334zM532.48 366.037333a64 64 0 0 0-83.114667 47.445334l-83.498666-17.578667A149.333333 149.333333 0 1 1 554.666667 569.770667v597.3333333H-85.33333333HH-85.333334V-64A42.666667 42.666667 0 0 1 42.666667-42.66666 64 64 0 0 0 20.48-124.629334Z <span class="token punctuation">&quot;</span></span><span class="token attr-name">P-ID</span> <span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span> 3795 <span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span> &lt;/ path&gt; <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>path</span> <span class="token attr-name">d</span> <span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span> M682 .666667 85.333333l213.333333 213.333334v597.333333a42.666667 42.666667 0 0 1-42.666667 42.666667H170.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V128a42.666667 42.666667 0 0 1 42.666667-42.666667h512zM213.333333 853.333333h597.333334V341. 333333h-170.666667V170.666667H213.333333v682.666666z<span class="token punctuation">&quot;</span></span> <span class="token attr-name">p-id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>3796<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>path</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>svg</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>\n</code></pre></div><p>Then add the icon in <code>.vitepress/theme/projects.vue</code></p><ol><li><p>First import the icon in <code>&lt;script setup&gt;&lt;/script&gt;</code> <code>import Simple from &#39;./icon/Simple.vue&#39; </code></p></li><li><p>Then add a line of code to line 37 <code>&lt;IconName v-else-if=&quot;item.icon === &#39;your project icon&#39;&quot; class=&quot;text-4xl opacity-50&quot; /&gt;</code></p></li></ol><p>This completes the introduction of new icons.</p><h3 id="add-blog" tabindex="-1">Add blog <a class="header-anchor" href="#add-blog" aria-hidden="true">#</a></h3><h4 id="modify-blog-style" tabindex="-1">Modify blog style <a class="header-anchor" href="#modify-blog-style" aria-hidden="true">#</a></h4><p>If you have this requirement, you can directly modify the <code>.vitepress/theme/Article.vue</code> file to modify the style</p><p>If you need to modify the styles like author and time, you can directly modify <code>.vitepress/theme/Author.vue</code> and <code>.vitepress/theme/Date.vue</code>.</p><h4 id="add-blog-1" tabindex="-1">Add blog <a class="header-anchor" href="#add-blog-1" aria-hidden="true">#</a></h4><p>Add a <code>md</code> file in the <code>posts</code> directory, remember that the name cannot be Chinese.</p><p>at the beginning of the <code>md</code> file, e.g.</p><div class="language-markdown"><pre><code><span class="token front-matter-block"><span class="token punctuation">---</span>\n<span class="token front-matter yaml language-yaml">title: this blog title\ndate: this blog date\nauthor: this blog author\ntwitter: &#39;this blog author twitter&#39;</span>\n<span class="token punctuation">---</span></span>\n\nthis blog description\n\n<span class="token hr punctuation">---</span>\n\ncontent\n</code></pre></div><p>will render as</p><p><img src="/assets/set1.fb1b7b20.png" alt=""></p><p>The content is rendered as</p><p><img src="/assets/set2.62cafbef.png" alt=""></p><h3 id="detail" tabindex="-1">detail <a class="header-anchor" href="#detail" aria-hidden="true">#</a></h3><p>I believe you have also discovered that there are still a few details in this way that have not changed. Then here will take you to change these places.</p><p>First, let<code>s open </code>.vitepress/theme/Layout.vue<code>On lines 12 and 5 we make</code>Simple Blog` the name you want.</p><p>If there are still places that have not been modified, you can file an <code>issue</code>.</p><h2 id="deploy" tabindex="-1">deploy <a class="header-anchor" href="#deploy" aria-hidden="true">#</a></h2><p>Deploy on GitHub, this project has become something you don&#39;t have to consider at all, modify a line of code in <code>.github/workflows/build.yml</code>, and change <code>simple.elonehoo.xyz</code> to your domain name on line 30 That&#39;s it.</p>',57)];var i=a(o,[["render",function(a,t,s,o,i,l){return e(),n("div",null,p)}]]);export{s as __pageData,i as default};