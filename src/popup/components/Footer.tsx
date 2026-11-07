import type { FC } from 'react';
import GithubIcon from 'src/assets/icons/github.svg?react';
import { GITHUB_URL } from 'src/shared/constants/links';
import { t } from 'src/shared/services/i18n';

const Footer: FC = () => (
    <footer className="mt-auto flex items-center justify-around gap-3 pt-7 pb-2">
        <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 rounded py-2 text-sm text-white/60 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
            <GithubIcon className="size-4" />
            {t('view_on_github')}
        </a>
    </footer>
);

export default Footer;
