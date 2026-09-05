import PptxGenJS from 'pptxgenjs';
import { PresentationData, TemplateTheme } from '../types';

export async function exportToPowerPoint(presentation: PresentationData, theme: TemplateTheme): Promise<void> {
  const pptx = new PptxGenJS();

  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'GravitySlides AI';
  pptx.company = 'Student Classroom Presenter';
  pptx.title = presentation.title;
  pptx.subject = presentation.topic;

  // Clean hex colors without # for pptxgenjs
  const cleanHex = (hex: string) => hex.replace('#', '');
  const bg = cleanHex(theme.bgHex);
  const cardBg = cleanHex(theme.cardBgHex);
  const primary = cleanHex(theme.primaryHex);
  const accent = cleanHex(theme.accentHex);
  const text = cleanHex(theme.textHex);
  const subtext = cleanHex(theme.subtextHex);

  // Iterate each slide and build custom layout based on slide.layoutType
  presentation.slides.forEach((slide, index) => {
    const pptSlide = pptx.addSlide();

    // Background color
    pptSlide.background = { color: bg };

    // Add subtle decorative top bar
    pptSlide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: 0.12,
      fill: { color: primary },
      line: { color: primary, width: 0 },
    });

    // Add speaker notes if provided (accessible in PowerPoint's Notes pane)
    if (slide.speakerNotes) {
      pptSlide.addNotes(
        `SPEAKER SCRIPT FOR STUDENT:\n${slide.speakerNotes}\n\nKey Takeaway: ${slide.callout || 'Present with confidence!'}`
      );
    }

    if (slide.layoutType === 'title' || index === 0) {
      // TITLE SLIDE
      // Central floating card
      pptSlide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: 1.0,
        w: 11.7,
        h: 5.5,
        fill: { color: cardBg },
        line: { color: accent, width: 1.5 },
        rectRadius: 0.2,
      });

      // Category badge
      pptSlide.addText(theme.badge.toUpperCase(), {
        x: 1.2,
        y: 1.4,
        w: 6.0,
        h: 0.4,
        fontSize: 11,
        fontFace: 'Arial',
        bold: true,
        color: primary,
      });

      // Main Title
      pptSlide.addText(slide.title, {
        x: 1.2,
        y: 1.8,
        w: 10.5,
        h: 1.8,
        fontSize: 34,
        fontFace: 'Arial',
        bold: true,
        color: text,
        valign: 'middle',
      });

      // Subtitle
      if (slide.subtitle) {
        pptSlide.addText(slide.subtitle, {
          x: 1.2,
          y: 3.6,
          w: 10.5,
          h: 0.8,
          fontSize: 18,
          fontFace: 'Arial',
          color: subtext,
        });
      }

      // Bullets as summary cards
      const bulletTexts = slide.bullets.map((b) => ({
        text: b.replace(/\*\*/g, ''),
        options: {
          fontSize: 14,
          color: text,
          bullet: true,
          breakLine: true,
        },
      }));

      pptSlide.addText(bulletTexts, {
        x: 1.2,
        y: 4.4,
        w: 10.5,
        h: 1.8,
        fontFace: 'Arial',
      });

      // Footer brand tag
      pptSlide.addText(`GravitySlides AI • ${presentation.topic} • ${presentation.studentLevel.toUpperCase()} LEVEL`, {
        x: 0.8,
        y: 6.8,
        w: 11.7,
        h: 0.4,
        fontSize: 10,
        fontFace: 'Arial',
        color: subtext,
        align: 'center',
      });
    } else {
      // CONTENT SLIDES (Split, Cards, or Summary)
      // Slide Header
      pptSlide.addText(`SLIDE ${slide.slideNumber} OF ${presentation.slideCount} • ${presentation.topic.toUpperCase()}`, {
        x: 0.8,
        y: 0.35,
        w: 10.0,
        h: 0.3,
        fontSize: 9,
        fontFace: 'Arial',
        bold: true,
        color: primary,
      });

      pptSlide.addText(slide.title, {
        x: 0.8,
        y: 0.65,
        w: 11.5,
        h: 0.9,
        fontSize: 24,
        fontFace: 'Arial',
        bold: true,
        color: text,
      });

      if (slide.subtitle) {
        pptSlide.addText(slide.subtitle, {
          x: 0.8,
          y: 1.45,
          w: 11.5,
          h: 0.45,
          fontSize: 13,
          fontFace: 'Arial',
          color: subtext,
        });
      }

      // Content Box (Left side)
      pptSlide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: 2.0,
        w: 6.8,
        h: 4.5,
        fill: { color: cardBg },
        line: { color: primary, width: 1 },
        rectRadius: 0.15,
      });

      // Bullets with rich formatting
      const bulletItems = slide.bullets.map((bullet) => {
        const clean = bullet.replace(/\*\*/g, '');
        return {
          text: clean,
          options: {
            fontSize: 14,
            color: text,
            bullet: true,
            breakLine: true,
            paraSpaceAfter: 12,
          },
        };
      });

      pptSlide.addText(bulletItems, {
        x: 1.1,
        y: 2.2,
        w: 6.2,
        h: 3.4,
        fontFace: 'Arial',
      });

      // Did You Know / Callout Pill
      if (slide.callout) {
        pptSlide.addShape(pptx.ShapeType.roundRect, {
          x: 1.1,
          y: 5.6,
          w: 6.2,
          h: 0.7,
          fill: { color: bg },
          line: { color: accent, width: 1 },
          rectRadius: 0.1,
        });

        pptSlide.addText(`💡 ${slide.callout}`, {
          x: 1.2,
          y: 5.65,
          w: 6.0,
          h: 0.6,
          fontSize: 11,
          fontFace: 'Arial',
          bold: true,
          color: accent,
          valign: 'middle',
        });
      }

      // Right Side Image & Visual Box
      if (slide.imageUrl) {
        try {
          if (slide.imageUrl.startsWith('data:')) {
            pptSlide.addImage({
              data: slide.imageUrl,
              x: 8.0,
              y: 2.0,
              w: 4.5,
              h: 3.4,
              rounding: true,
            });
          } else {
            pptSlide.addImage({
              path: slide.imageUrl,
              x: 8.0,
              y: 2.0,
              w: 4.5,
              h: 3.4,
              rounding: true,
            });
          }
        } catch (e) {
          console.log('[PPTX Export] Using stylized placeholder for image.');
          pptSlide.addShape(pptx.ShapeType.roundRect, {
            x: 8.0,
            y: 2.0,
            w: 4.5,
            h: 3.4,
            fill: { color: cardBg },
            line: { color: accent, width: 1 },
          });
          pptSlide.addText(`[Visual Illustration: ${slide.imagePrompt}]`, {
            x: 8.2,
            y: 3.2,
            w: 4.1,
            h: 1.0,
            fontSize: 12,
            color: subtext,
            align: 'center',
          });
        }

        // Image caption/notes below image
        pptSlide.addShape(pptx.ShapeType.roundRect, {
          x: 8.0,
          y: 5.6,
          w: 4.5,
          h: 0.7,
          fill: { color: cardBg },
          line: { color: bg, width: 0.5 },
          rectRadius: 0.1,
        });

        pptSlide.addText(`Visual: ${slide.imagePrompt}`, {
          x: 8.1,
          y: 5.65,
          w: 4.3,
          h: 0.6,
          fontSize: 10,
          fontFace: 'Arial',
          color: subtext,
          align: 'center',
          valign: 'middle',
        });
      }

      // Slide footer
      pptSlide.addText(`GravitySlides AI • Classroom Deck`, {
        x: 0.8,
        y: 6.9,
        w: 6.0,
        h: 0.3,
        fontSize: 9,
        fontFace: 'Arial',
        color: subtext,
      });

      pptSlide.addText(`${slide.slideNumber}`, {
        x: 11.5,
        y: 6.9,
        w: 1.0,
        h: 0.3,
        fontSize: 10,
        fontFace: 'Arial',
        bold: true,
        color: primary,
        align: 'right',
      });
    }
  });

  // Final Slide for Google Search Grounding Sources & Bibliography
  if (presentation.sources && presentation.sources.length > 0) {
    const bibSlide = pptx.addSlide();
    bibSlide.background = { color: bg };

    bibSlide.addText('RESEARCH SOURCES & FACTUAL GROUNDING', {
      x: 0.8,
      y: 0.8,
      w: 11.5,
      h: 0.5,
      fontSize: 16,
      fontFace: 'Arial',
      bold: true,
      color: primary,
    });

    bibSlide.addText('Verified via Google Search & Academic Grounding Engine', {
      x: 0.8,
      y: 1.3,
      w: 11.5,
      h: 0.4,
      fontSize: 12,
      fontFace: 'Arial',
      color: subtext,
    });

    const sourceRows = presentation.sources.map((s) => ({
      text: `${s.title}\n${s.url}`,
      options: {
        fontSize: 12,
        color: text,
        bullet: true,
        breakLine: true,
        paraSpaceAfter: 10,
      },
    }));

    bibSlide.addText(sourceRows, {
      x: 0.8,
      y: 2.0,
      w: 11.5,
      h: 4.5,
      fontFace: 'Arial',
    });
  }

  // Trigger browser download
  const safeFilename = presentation.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 32);
  await pptx.writeFile({ fileName: `${safeFilename || 'Presentation'}_GravitySlides.pptx` });
}
