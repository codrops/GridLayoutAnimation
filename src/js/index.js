import { preloadImages } from './utils';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
gsap.registerPlugin(Flip);

let DOM = {
    body: document.body,
    frame: {
        backHome: document.querySelector('.frame__home'),
    },
    content: {
        gridWrap: document.querySelector('.content .grid-wrap'),
        grid: document.querySelector('.content .grid'),
        items: [...document.querySelectorAll('.content .grid__item')],
        trigger: document.querySelector('.enter__link'),
    },
    works: {
        section: document.querySelector('.works'),
        titles: [...document.querySelectorAll('.works__title .oh__inner')]
    }
};

const itemsTotal = DOM.content.items.length;

let state = 'home'; // home||works
let isAnimating = false;

let duration = 1;
let ease = 'power4.inOut';
let stagger = {
    each: 0.04,
    from: 'end',
    grid: 'auto'
};

const openWorks = () => {
    if ( isAnimating ) return;
    isAnimating = true;

    const flipstate = Flip.getState(DOM.content.items);

    gsap.timeline({
        defaults: {duration: duration, ease: ease},
        onStart: () => {
            state = 'works';

            DOM.works.section.appendChild(DOM.content.grid);
            
            DOM.works.section.classList.add('works--open');
            DOM.body.classList.add('preview-open');
            
            gsap.set(DOM.content.items, {
                transformOrigin: pos => pos >= itemsTotal/2 ? '50% 0%' : '50% 100%'
            });
    
            gsap.set(DOM.works.titles, {
                yPercent: pos => pos ? -101 : 101,
                opacity: 0
            });

            DOM.frame.backHome.classList.add('frame__home--show');
            gsap.set(DOM.frame.backHome.querySelector('.oh__inner'), {
                yPercent: 101
            });
        },
        onComplete: () => isAnimating = false
    })
    .addLabel('start', 0)
    // gsap Flip logic
    .add(() => {
        Flip.from(flipstate, {
            duration: duration,
            ease: ease,
            stagger: stagger,
            absolute: true,
        });
    }, 'start')
    
    // hide enter link
    .to(DOM.content.trigger, {
        duration: duration,
        yPercent: -100,
        opacity: 0
    }, 'start')
    // show back button
    .to(DOM.frame.backHome.querySelector('.oh__inner'), {
        duration: duration,
        yPercent: 0
    }, 'start')

    .to(DOM.works.titles, {
        duration: duration*1.2,
        stagger: -0.1,
        yPercent: 0,
        opacity: 1
    }, 'start')
    
    .to(DOM.content.items, {
        duration: duration/2,
        ease: 'power1.in',
        stagger: stagger,
        scaleY: 1.4
    }, 'start')
    .to(DOM.content.items, {
        duration: duration/2,
        ease: 'power4',
        stagger: stagger,
        scaleY: 1
    }, `start+=${duration/2}`)
}

const home = () => {

    if ( isAnimating ) return;
    isAnimating = true;

    const flipstate = Flip.getState(DOM.content.items);

    gsap.timeline({
        defaults: {duration: duration, ease: ease},
        onStart: () => {
            state = 'home';

            DOM.content.gridWrap.appendChild(DOM.content.grid);
            
            DOM.body.classList.remove('preview-open');
            
            gsap.set(DOM.content.items, {
                transformOrigin: pos => pos >= itemsTotal/2 ? '50% 100%' : '50% 0%'
            });
        },
        onComplete: () => {
            DOM.frame.backHome.classList.remove('frame__home--show');
            DOM.works.section.classList.remove('works--open');
            isAnimating = false;
        }
    })
    .addLabel('start', 0)
    // gsap Flip logic
    .add(() => {
        Flip.from(flipstate, {
            duration: duration,
            ease: ease,
            stagger: stagger,
            absolute: true
        });
    }, 'start')
    // show enter link
    .to(DOM.content.trigger, {
        duration: duration,
        yPercent: 0,
        opacity: 1
    }, 'start')
    // hide back button
    .to(DOM.frame.backHome.querySelector('.oh__inner'), {
        duration: duration,
        yPercent: 101
    }, 'start')

    .to(DOM.works.titles, {
        duration: duration,
        stagger: -0.1,
        yPercent: pos => pos ? 101 : -101,
        opacity: 0
    }, 'start')

}

// click "Enter"
DOM.content.trigger.addEventListener('click', () => {
    openWorks();
});

// click "Home"
DOM.frame.backHome.addEventListener('click', () => {
    home();
});

// Hover events for the items
DOM.content.items.forEach((item, pos) => {
    
    const img = item.querySelector('.grid__item-img');

    item.addEventListener('mouseenter', () => {
        if ( state !== 'works' || isAnimating ) return;
        
        gsap.killTweensOf([item, img]);
        
        gsap.timeline({defaults:{duration: duration, ease: 'expo',}})
        .addLabel('start', 0)
        .set(item, {
            transformOrigin: pos >= itemsTotal/2 ? '50% 100%' : '50% 0%'
        })
        .to(item, {
            scaleY: 1.1
        }, 'start')
        .to(img, {
            scale: 1.2
        }, 'start');
    });

    item.addEventListener('mouseleave', () => {
        if ( state !== 'works' || isAnimating ) return;

        gsap.killTweensOf([item, img]);
        
        gsap.timeline({defaults:{duration: duration, ease: 'expo',}})
        .addLabel('start', 0)
        .to(item, {
            scaleY: 1
        }, 'start')
        .to(img, {
            scale: 1
        }, 'start');
    });

});

// Preload images
preloadImages('.grid__item-img').then( _ => document.body.classList.remove('loading'));