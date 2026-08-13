package com.ppmp.infrastructure.pdf;

import com.ppmp.modules.portfolio.dto.PublicPortfolioDto;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfGeneratorService {

    public byte[] generatePortfolioPdf(PublicPortfolioDto portfolio) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);
        PdfFont bold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        PdfFont normal = PdfFontFactory.createFont(StandardFonts.HELVETICA);

        Paragraph title = new Paragraph();
        title.setFont(bold).setFontSize(24).setTextAlignment(TextAlignment.CENTER);
        title.add(new Text(portfolio.getUser().getFullName() != null
                ? portfolio.getUser().getFullName()
                : portfolio.getUser().getUsername()));
        document.add(title);

        if (portfolio.getSettings() != null) {
            if (portfolio.getSettings().getHeadline() != null) {
                Paragraph headline = new Paragraph()
                        .setFont(normal).setFontSize(14).setTextAlignment(TextAlignment.CENTER);
                headline.add(new Text(portfolio.getSettings().getHeadline()));
                document.add(headline);
            }
            if (portfolio.getSettings().getAboutText() != null) {
                document.add(new Paragraph("About").setFont(bold).setFontSize(16));
                document.add(new Paragraph(portfolio.getSettings().getAboutText()).setFont(normal).setFontSize(11));
            }
        }

        document.add(new Paragraph("Projects (" + portfolio.getProjects().size() + ")")
                .setFont(bold).setFontSize(16));

        for (var project : portfolio.getProjects()) {
            document.add(new Paragraph(project.getTitle()).setFont(bold).setFontSize(13));
            if (project.getShortDescription() != null) {
                document.add(new Paragraph(project.getShortDescription()).setFont(normal).setFontSize(10));
            }
            if (project.getTechnologyNames() != null && !project.getTechnologyNames().isEmpty()) {
                document.add(new Paragraph("Stack: " + String.join(", ", project.getTechnologyNames()))
                        .setFont(normal).setFontSize(9));
            }
            document.add(new Paragraph("Progress: " + project.getProgressPercentage() + "%")
                    .setFont(normal).setFontSize(9));
            document.add(new Paragraph(" "));
        }

        document.close();
        return out.toByteArray();
    }
}
