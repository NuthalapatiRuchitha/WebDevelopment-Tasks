        function scrollToSection(sectionId) {
            document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
        }

        
        document.getElementById('contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            this.reset();
            
        });