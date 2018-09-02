set nocompatible
filetype off

set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()

Plugin 'VundleVim/Vundle.vim'
Plugin 'scrooloose/nerdtree', { 'on':  'NERDTreeToggle' }

Plugin 'tpope/vim-surround'

Plugin 'tpope/vim-fugitive'  
Plugin 'vim-airline/vim-airline'
Plugin 'vim-airline/vim-airline-themes'
Plugin 'flazz/vim-colorschemes'

Plugin 'ctrlpvim/ctrlp.vim'

if executable('ag')

  set grepprg=ag\ --nogroup\ --nocolor

  let g:ctrlp_user_command = 'ag %s -l --nocolor -g ""'
  let g:ctrlp_working_path_mode = 'r'

  let g:ctrlp_use_caching = 0

  let g:ctrlp_extensions = ['line']
endif

Plugin 'vim-scripts/tComment'

Plugin 'ervandew/supertab'
Plugin 'SirVer/ultisnips' 
Plugin 'justinj/vim-react-snippets' 

Plugin 'prettier/vim-prettier', { 'do': 'yarn install' }

Plugin 'suan/vim-instant-markdown'

call vundle#end()
filetype plugin indent on

" General Vim settings
syntax on
let mapleader=","
set autoindent
set tabstop=2
set shiftwidth=2
set dir=/tmp/
set relativenumber 
set number

set cursorline
hi Cursor ctermfg=White ctermbg=Yellow cterm=bold guifg=white guibg=yellow gui=bold

set hlsearch
nnoremap <C-l> :nohl<CR><C-l>:echo "Search Cleared"<CR>
nnoremap <C-c> :set norelativenumber<CR>:set nonumber<CR>:echo "Line numbers turned off."<CR>
nnoremap <C-n> :set relativenumber<CR>:set number<CR>:echo "Line numbers turned on."<CR>

nnoremap n nzzzv
nnoremap N Nzzzv

nnoremap H 0
nnoremap L $
nnoremap J G
nnoremap K gg

map <tab> %

set backspace=indent,eol,start

nnoremap <Space> za
nnoremap <leader>z zMzvzz

nnoremap vv 0v$

set listchars=tab:\|\ 
nnoremap <leader><tab> :set list!<cr>
set pastetoggle=<F2>
set mouse=a
set incsearch

inoremap {<cr> {<cr>}<c-o><s-o>
inoremap [<cr> [<cr>]<c-o><s-o>
inoremap (<cr> (<cr>)<c-o><s-o>

" Plugin stuff

" Close vim if only NERDTree is open
map <silent> <C-n> :NERDTreeToggle<cr>

silent! colorscheme SlateDark

" Set ultisnips triggers
let g:UltiSnipsSnippetsDir='~/.vim/ultisnips-snippets'   " Custom snippets dir
let g:UltiSnipsSnippetDirectories=['ultisnips-snippets'] " Custom snippets dir
let g:UltiSnipsExpandTrigger="<tab>"
let g:UltiSnipsJumpForwardTrigger="<tab>"
let g:UltiSnipsJumpBackwardTrigger="<s-tab>"
let g:UltiSnipsEditSplit="vertical"

" Enable vim-prettier to run in files without requiring the "@format" doc tag
let g:prettier#autoformat = 0
let g:prettier#config#tab_width = 2
autocmd BufWritePre *.js,*.jsx,*.mjs,*.ts,*.tsx,*.css,*.less,*.scss,*.json,*.graphql,*.md Prettier

let g:instant_markdown_slow = 1
let g:instant_markdown_autostart = 1
