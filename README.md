# Jazz Engineering Blog



## Contents

- [Local Development](#local-development)
  - [Installation](#installation)
  - [How to Run](#how-to-run)
- [Contributing](#contributing)
  - [Post Formatting and Setup](#post-formatting-and-setup)
- [Theme Author](#theme-author)
- [License](#license)

## Local Development

### Installation
These instructions assume you are using [RVM](https://rvm.io/).

    rvm install 2.1.1
    rvm —default use 2.1.1
    gem install bundler
    git clone git@github.com:jazzco/jazzco.github.io
    cd jazzco.github.io
    bundle install

### How to Run

    jekyll serve
    
## Contributing

### Post Formatting and Setup
All posts are stored in the `_posts` directory. The filename format is `YYYY-MM-DD-post-name.md`.
The file name is what generates the slug for your post, so try to keep it concise.
The official date of the post may change depending on how long it sits in queue for review and when it is intended to be published.

All our posts are written in markdown, for more info on that format checkout

To start off any post, you need to put the required YAML front matter. An example of what we are requiring can be seen below:
``` yaml
---
layout: post
title: Your Post Title Here
tags: some tags here
author: Author Name
---
```
`layout`: always going to be post. This may change in the future if we need to add special post formats for embedding code samples.

`title`: clearly the title of your post, you can be more verbose here than in the slug for your post title.

`tags`: where you will identify some information about your post, ideally something specific like the language and framework mentioned in the post.

`author`: this is your name.

For highlighting code snippets in posts, we use pygments. For more info on using that in Jekyll, checkout the [Jekyll docs](http://jekyllrb.com/docs/posts/#highlighting-code-snippets).

### Submitting a Post

We are utilizing the PR system here to manage any posts. Please keep your new post in a separate branch and create PR for it so it can be reviewed before it is ready to go live. Be sure to give it the label of `post` when you file the PR.

## Theme Author

**Mark Otto**
- <https://github.com/mdo>
- <https://twitter.com/mdo>


## License

This blog and its theme are both open source under the [MIT license](LICENSE.md).
