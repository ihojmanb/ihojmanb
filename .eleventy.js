const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const markdownItLinkAttr = require('markdown-it-link-attributes');
const markdownIt = require("markdown-it");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pageAssetsPlugin = require('eleventy-plugin-page-assets');
const markdownItAnchor = require("markdown-it-anchor");
let Nunjucks = require("nunjucks");

module.exports = function (eleventyConfig) {

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
//   eleventyConfig.addPlugin(pageAssetsPlugin, {
//     mode: "parse",
//     postsMatching: "src/writing/posts/*/*.md",
// });
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("admin");

  const { DateTime } = require("luxon");
  // eleventyConfig.addPassthroughCopy("./src/css");
  // eleventyConfig.addWatchTarget("./src/css/");
  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: "utc",
    }).toFormat("yy-MM-dd");
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: "utc",
    }).toFormat("dd-MM-yy");
  });

  // Markdown
  eleventyConfig.setLibrary(
    "md",
    require("markdown-it")("commonmark")
    .use(require("markdown-it-attrs"
    ))
    .use(markdownItLinkAttr, {
      // Make external links open in a new tab.
      pattern: /^https?:\/\//,
      attrs: {
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    })
  );
  // Options for the `markdown-it` library
  const markdownItOptions = {
    html: true,
  };
  // This object is required inside the renderPermalink function.
  // It's copied directly from the plugin source code.
  const position = {
    false: "push",
    true: "unshift",
  }

  // Copied directly from the plugin source code, with one edit
  // (marked with comments)
  
  const renderPermalink = (slug, opts, state, idx) => {
    const space = () =>
      Object.assign(new state.Token("text", "", 0), {
        content: " ",
      })

    const linkTokens = [
      Object.assign(new state.Token("link_open", "a", 1), {
        attrs: [
          ["class", opts.permalinkClass],
          ["href", opts.permalinkHref(slug, state)],
        ],
      }),
      Object.assign(new state.Token("html_block", "", 0), {
        // Edit starts here:
        content: `<span aria-hidden="true" class="hover:underline text-pink-500">$</span>
        
        `,
        // Edit ends
      }),
      new state.Token("link_close", "a", -1),
    ]

    if (opts.permalinkSpace) {
      linkTokens[position[!opts.permalinkBefore]](space())
    }
    state.tokens[idx + 1].children[position[opts.permalinkBefore]](
      ...linkTokens
    )
  }
  // Options for the `markdown-it-anchor` library
  const markdownItAnchorOptions = {

    permalink: true,
    renderPermalink
  };

  const markdownLib = markdownIt(markdownItOptions).use(
    markdownItAnchor,
    markdownItAnchorOptions
  )

  eleventyConfig.setLibrary("md", markdownLib)


  // Customize Nunjucks Environment
  let nunjucksEnvironment = new Nunjucks.Environment(
    new Nunjucks.FileSystemLoader("src/_includes"),
    {
      lstripBlocks: true,
      trimBlocks: true
    }
  );
  eleventyConfig.setLibrary("njk", nunjucksEnvironment);




  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    // templateFormats: ["md", "njk"],
    htmlTemplateEngine: "njk"
  };
};
