/* eslint no-console:0 */
require('../src/sass/application.scss')
require('../src/js/components/waves')
import Mudhead from '../src/js/mudhead'
import MdInput from '../src/js/components/md_input'
// import MdSidenav from '../src/js/components/md_sidenav';

Mudhead.addAfterPageLoadedEvent(MdInput.activate)
// Mudhead.addAfterPageLoadedEvent(MdSidenav.activate);
Mudhead.init()
